import { createContext, useState } from "react";
import * as Ably from "ably";

export const channelContext = createContext(null);

export default function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);

  const connect = async ({ token, roomId, admin, role, clientId, title }) => {
    setRoomInfo({
      title: title,
      clientId: clientId,
      roomId: roomId,
      admin: admin,
      role: role,
    });
    const client = new Ably.Realtime.Promise({ token });

    await client.connection.once("connected");

    const ablyChannel = client.channels.get(roomId);
    setChannel(ablyChannel);
  };

  return (
    <channelContext.Provider value={{ channel, connect, roomInfo, members }}>
      {children}
    </channelContext.Provider>
  );
}
