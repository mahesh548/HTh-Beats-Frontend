import { createContext, useContext, useState } from "react";
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
  const [roomInfo, setRoomInfo] = useState({});

  const [members, setMembers] = useState([]);
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

      console.log("members", onlyMembersData);
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

  return (
    <channelContext.Provider value={{ channel, connect, roomInfo, members }}>
      {children}
    </channelContext.Provider>
  );
}
