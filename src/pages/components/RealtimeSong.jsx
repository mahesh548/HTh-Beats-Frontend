import { useContext, useEffect } from "react";
import { channelContext } from "./Channel";
import { songContext } from "./Song";

export default function RealtimeSong() {
  const { currentSong, setCurrentSong, roomInfo } = useContext(channelContext);
  const { Queue, setQueue } = useContext(songContext);

  useEffect(() => {
    if (!currentSong || !roomInfo) return;
    if (currentSong?.clientId == roomInfo?.clientId) return;

    console.log("song played by: ", currentSong.clientId);
  }, [currentSong?.songId]);

  useEffect(() => {
    if (!roomInfo) return;
    if (!currentSong) {
      setCurrentSong({
        songId: Queue?.song,
        clientId: roomInfo?.clientId,
      });
      return;
    }
    if (
      currentSong?.clientId == roomInfo?.clientId &&
      currentSong?.songId == Queue?.song
    )
      return;
    setCurrentSong({
      songId: Queue?.song,
      clientId: roomInfo?.clientId,
    });
    console.log("you played song :", Queue?.song);
  }, [Queue?.song]);

  return <></>;
}
