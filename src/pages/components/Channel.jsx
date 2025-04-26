import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { AuthContext } from "./Auth";
import utils from "../../../utils";
import { useNavigate } from "react-router";
import { showToast } from "./showToast";

export const channelContext = createContext(null);

export default function ChannelProvider({ children }) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const pici = "https://" + window.location.hostname + "/logo.png";
  const defaultUser = {
    pic: pici,
    username: "HTh-User",
  };

  const testInfo = { title: "test room" };
  const testMembers = [defaultUser, defaultUser, defaultUser, defaultUser];
  // const [roomInfo, setRoomInfo] = useState(testInfo);
  // const [members, setMembers] = useState(testMembers);

  const [channel, setChannel] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playState, setPlayState] = useState(false);
  const isRemoteSeek = useRef(false);
  const [messages, setMessages] = useState([]);
  const ablyClient = useRef(null);

  const connect = async ({ token, roomId, admin, role, clientId, title }) => {
    try {
      setRoomInfo({
        title: title,
        clientId: clientId,
        roomId: roomId,
        admin: admin,
        role: role,
      });

      const client = new Ably.Realtime({ token, clientId });
      await client.connection.once("connected");
      ablyClient.current = client;

      const ablyChannel = client.channels.get(roomId);

      //entering presence in the channel
      await ablyChannel.presence.enter({
        username: auth?.user?.username,
        role: role,
        pic: auth?.user?.pic,
        clientId: clientId,
        time: new Date(),
      });
      //getting current member in the room
      const members = await ablyChannel.presence.get();
      const onlyMembersData = members
        .map((member) => ({
          ...member.data,
          clientId: member.clientId,
        }))
        .sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        });

      setMembers(onlyMembersData);

      ablyChannel.subscribe("sync", (message) => {
        if (
          message.clientId === clientId ||
          message.data.sync.newUser != clientId ||
          message.clientId != admin
        )
          return;

        const remoteSync = message.data.sync;
        setCurrentSong(remoteSync.song);
        setPlayState(remoteSync.playState);
        document.getElementById("audio").currentTime = remoteSync.currentTime;
      });

      ablyChannel.subscribe("block", async (message) => {
        if (
          message.data.block.blockId != clientId &&
          message.clientId == admin
        ) {
          const newMessage = {
            type: "block",
            username: message.data.block.username,
          };
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
        if (
          message.clientId === clientId ||
          message.data.block.blockId != clientId ||
          message.clientId != admin
        )
          return;

        await ablyChannel.presence.leave();
        ablyClient.current.close();

        setChannel(null);
        setRoomInfo(null);
        setCurrentSong(null);
        setMembers([]);
        navigate("/home");
      });
      ablyChannel.subscribe("song", (message) => {
        if (message.clientId === clientId) return;
        const remoteCurrentSong = message.data.remoteCurrentSong;
        setCurrentSong(remoteCurrentSong);
      });
      ablyChannel.subscribe("playState", (message) => {
        if (message.clientId === clientId) return;
        const remoteSongState = message.data.remoteSongState;
        setPlayState(remoteSongState);
      });

      ablyChannel.subscribe("durationChange", (message) => {
        if (message.clientId === clientId) return;

        const remoteDuartion = message.data.remoteDuartion;
        const audio = document.getElementById("audio");

        if (!audio) return;

        // Optional: Add a small threshold to avoid unnecessary seeks
        if (Math.abs(audio.currentTime - remoteDuartion.currentTime) > 0.3) {
          isRemoteSeek.current = true;
          audio.currentTime = remoteDuartion.currentTime;
        }
      });

      //set the channel
      setChannel(ablyChannel);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  };

  useEffect(() => {
    if (!channel || !currentSong || !roomInfo) return;
    if (currentSong.clientId != roomInfo.clientId) return;
    channel.publish("song", {
      remoteCurrentSong: currentSong,
    });
  }, [currentSong?.songId]);

  useEffect(() => {
    if (!channel || !playState || !roomInfo) return;
    if (playState.clientId != roomInfo.clientId) return;
    channel.publish("playState", {
      remoteSongState: playState,
    });
  }, [playState?.state]);

  useEffect(() => {
    if (!channel || !roomInfo) return;

    const audio = document.getElementById("audio");
    if (!audio) return;

    let debounceTimeout;

    const handleSeeked = (e) => {
      if (isRemoteSeek.current) {
        isRemoteSeek.current = false;
        return;
      }

      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        channel.publish("durationChange", {
          remoteDuartion: {
            currentTime: e.target.currentTime,
            clientId: roomInfo.clientId,
          },
        });
      }, 500);
    };

    audio.addEventListener("seeked", handleSeeked);

    return () => {
      clearTimeout(debounceTimeout);
      audio.removeEventListener("seeked", handleSeeked);
    };
  }, [currentSong?.songId, channel, roomInfo]);

  useEffect(() => {
    if (!channel || !roomInfo) return;
    //when a member leaves the room

    const handleLeave = (member) => {
      if (member.clientId == roomInfo?.admin) {
        showToast({ text: "Room ended by admin" });
        disconnect();
        return;
      }
      const newMember = member.data;

      if (!location.pathname.includes("room")) {
        //show toast message if user is not at room page
        showToast({
          text: `${
            newMember?.username || defaultUser.username
          } has left the room`,
          image: newMember?.pic || defaultUser.pic,
          type: "imgBtn",
        });
      }
      const newMessage = {
        type: "leave",
        username: newMember.username,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMembers((prevMembers) => {
        return prevMembers
          .filter((item) => item.clientId !== newMember.clientId)
          .sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
          });
      });
    };
    const handleEnter = (member) => {
      member.data.clientId = member.clientId;
      const newMember = member.data;
      if (!location.pathname.includes("room")) {
        //show toast message if user is not at room page
        showToast({
          text: `${
            newMember?.username || defaultUser.username
          } has joined the room`,
          image: newMember?.pic || defaultUser.pic,
          type: "imgBtn",
        });
      }
      const newMessage = {
        type: "join",
        username: newMember.username,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMembers((prevMembers) => {
        return [...prevMembers, newMember].sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        });
      });
      if (roomInfo.role === "admin") {
        channel.publish("sync", {
          sync: {
            song: currentSong,
            playState: playState,
            currentTime: document.getElementById("audio")?.currentTime,
            newUser: member.clientId,
          },
        });
      }
    };

    const handleReaction = (message) => {
      if (message.clientId === roomInfo.clientId) return;
      const newReact = message.data.newReact;
      if (!location.pathname.includes("room")) {
        //show toast message if user is not at room page
        const person = members.find(
          (item) => item.clientId == message.clientId
        );
        showToast({
          text: `${person?.username || defaultUser.username} sent a reaction`,
          image:
            utils.stickerUrl(newReact.pack, newReact.id) || defaultUser.pic,
          type: "imgBtn",
        });
      }
      newReact.type = "remote-react";
      setMessages((prevMessages) => [newReact, ...prevMessages]);
    };
    channel.presence.subscribe("leave", handleLeave);
    channel.presence.subscribe("enter", handleEnter);
    channel.subscribe("reaction", handleReaction);

    return () => {
      channel.presence.unsubscribe("leave", handleLeave);
      channel.presence.unsubscribe("enter", handleEnter);
      channel.unsubscribe("reaction", handleReaction);
    };
  }, [roomInfo?.roomId, channel, currentSong, playState]);

  useEffect(() => {
    if (!members || members.length === 0) return;
    const adminCount = members.filter((m) => m.role === "admin").length;

    if (adminCount !== 1) {
      disconnect();
    }
  }, [members]);

  const disconnect = async () => {
    if (!channel) return;
    try {
      if (roomInfo.role === "admin") {
        const roomData = {
          inviteCode: roomInfo?.roomId,
        };
        await utils.BACKEND("/room/delete", "POST", {
          roomData: roomData,
        });
        showToast({ text: "Room deleted" });
      } else {
        showToast({ text: "Left the room" });
      }
      await channel.presence.leave();
      ablyClient.current.close();

      setChannel(null);
      setRoomInfo(null);
      setCurrentSong(null);
      setMembers([]);
      navigate("/home");
    } catch (err) {
      console.error("Error while disconnecting:", err);
    }
  };

  const sendReaction = async (pack, id) => {
    if (!channel) return;
    try {
      const newReact = {
        pack: pack,
        id: id,
        clientId: roomInfo.clientId,
        type: "local-react",
      };
      setMessages((prevMessages) => [newReact, ...prevMessages]);
      await channel.publish("reaction", { newReact: newReact });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const block = async (id) => {
    if (!channel || !roomInfo) return;
    if (
      roomInfo?.admin == id ||
      roomInfo?.admin != roomInfo?.clientId ||
      roomInfo?.role != "admin"
    )
      return;
    const blockData = {
      blockId: id,
      inviteCode: roomInfo?.roomId,
    };
    const response = await utils.BACKEND("/room/block", "POST", {
      roomData: blockData,
    });
    if (response?.status && response?.block) {
      channel.publish("block", {
        block: {
          blockId: id,
          username:
            members.find((m) => m.clientId == id)?.username ||
            defaultUser.username,
        },
      });
    }
  };

  return (
    <channelContext.Provider
      value={{
        channel,
        connect,
        roomInfo,
        members,
        currentSong,
        setCurrentSong,
        playState,
        setPlayState,
        disconnect,
        defaultUser,
        messages,
        sendReaction,
        block,
      }}
    >
      {children}
    </channelContext.Provider>
  );
}
