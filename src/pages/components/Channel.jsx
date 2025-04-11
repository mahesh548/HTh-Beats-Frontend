import { createContext, useContext, useEffect, useState } from "react";
import * as Ably from "ably";
import { AuthContext } from "./Auth";

const pici = "https://" + window.location.hostname + "/logo.png";
const testInfo = { title: "room" };
const testMembers = [
  {
    pic: pici,
  },
  {
    pic: pici,
  },
  {
    pic: pici,
  },
  {
    pic: pici,
  },
  {
    pic: pici,
  },
];
export const channelContext = createContext(null);
export default function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [members, setMembers] = useState(null);
  const [playState, setPlayState] = useState(false);
  const auth = useContext(AuthContext);
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

      //when a new member enters the room
      ablyChannel.presence.subscribe("enter", (member) => {
        member.data.clientId = member.clientId;
        const newMember = member.data;
        setMembers((prevMembers) => [...prevMembers, newMember]);
      });

      //when a member leaves the room
      ablyChannel.presence.subscribe("leave", (member) => {
        const newMember = member.data;
        setMembers((prevMembers) =>
          prevMembers.filter((item) => item.clientId !== newMember.clientId)
        );
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
      }}
    >
      {children}
    </channelContext.Provider>
  );
}
