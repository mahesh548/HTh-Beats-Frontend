import { createContext, useState } from "react";
import * as Ably from "ably";

export const channelContext = createContext(null);

export default function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null);

  const connect = async ({ token, channelId }) => {
    const client = new Ably.Realtime.Promise({ token });

    await client.connection.once("connected");

    const ablyChannel = client.channels.get(channelId);
    setChannel(ablyChannel);
  };

  return (
    <channelContext.Provider value={{ channel, connect }}>
      {children}
    </channelContext.Provider>
  );
}
