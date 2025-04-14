import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { AuthContext } from "./Auth";
import utils from "../../../utils";
import { useNavigate } from "react-router";

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
      });
      //getting current member in the room
      const members = await ablyChannel.presence.get();
      const onlyMembersData = members.map((member) => ({
        ...member.data,
        clientId: member.clientId,
      }));

      setMembers(onlyMembersData);

      ablyChannel.subscribe("sync", (message) => {
        if (
          message.clientId === clientId ||
          message.data.sync.newUser != clientId ||
          message.clientId != roomInfo.admin
        )
          return;

        const remoteSync = message.data.sync;
        setCurrentSong(remoteSync.song);
        setPlayState(remoteSync.playState);
        document.getElementById("audio").currentTime = remoteSync.currentTime;
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

      ablyChannel.subscribe("reaction", (message) => {
        if (message.clientId === clientId) return;
        const newReact = message.data.newReact;
        newReact.type = "remote-react";
        setMessages((prevMessages) => [newReact, ...prevMessages]);
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
        disconnect();
        return;
      }
      const newMember = member.data;
      const newMessage = {
        type: "leave",
        username: newMember.username,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMembers((prevMembers) =>
        prevMembers.filter((item) => item.clientId !== newMember.clientId)
      );
    };
    const handleEnter = (member) => {
      member.data.clientId = member.clientId;
      const newMember = member.data;
      const newMessage = {
        type: "join",
        username: newMember.username,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMembers((prevMembers) => [...prevMembers, newMember]);
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
    channel.presence.subscribe("leave", handleLeave);
    channel.presence.subscribe("enter", handleEnter);

    return () => {
      channel.presence.unsubscribe("leave", handleLeave);
      channel.presence.unsubscribe("enter", handleEnter);
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
      }}
    >
      {children}
    </channelContext.Provider>
  );
}
