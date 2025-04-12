import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { AuthContext } from "./Auth";
import utils from "../../../utils";
import { useNavigate } from "react-router";

export const channelContext = createContext(null);
export default function ChannelProvider({ children }) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // const [roomInfo, setRoomInfo] = useState(testInfo);
  // const [members, setMembers] = useState(testMembers);
  const pici = "https://" + window.location.hostname + "/logo.png";
  const defaultUser = {
    pic: pici,
    username: "HTh-User",
  };

  const [channel, setChannel] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [members, setMembers] = useState([]);
  const [playState, setPlayState] = useState(false);
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

      //when a new member enters the room
      ablyChannel.presence.subscribe("enter", (member) => {
        member.data.clientId = member.clientId;
        const newMember = member.data;
        setMembers((prevMembers) => [...prevMembers, newMember]);
      });

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
        document.getElementById("audio").currentTime =
          remoteDuartion.currentTime;
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
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        channel.publish("durationChange", {
          remoteDuartion: {
            currentTime: e.target.currentTime,
            clientId: roomInfo.clientId,
          },
        });
      }, 200);
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
    channel.presence.subscribe("leave", (member) => {
      console.log("admin", roomInfo?.admin);
      console.log("member", member.clientId);
      if (member.clientId == roomInfo?.admin) {
        disconnect();
        return;
      }
      const newMember = member.data;
      setMembers((prevMembers) =>
        prevMembers.filter((item) => item.clientId !== newMember.clientId)
      );
    });
  }, [roomInfo?.roomId, channel]);

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
      }}
    >
      {children}
    </channelContext.Provider>
  );
}
