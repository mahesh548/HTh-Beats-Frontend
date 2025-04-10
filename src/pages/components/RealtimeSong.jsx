import { useContext, useEffect } from "react";
import { channelContext } from "./Channel";
import { songContext } from "./Song";

export default function RealtimeSong() {
  const { currentSong, setCurrentSong, roomInfo, playState, setPlayState } =
    useContext(channelContext);
  const { Queue, setQueue } = useContext(songContext);

  useEffect(() => {
    //if remote user played the song
    if (!currentSong || !roomInfo) return;
    if (currentSong?.clientId == roomInfo?.clientId) return;

    console.log("song played by: ", currentSong.clientId);
  }, [currentSong?.songId]);

  useEffect(() => {
    //if user played the song
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

  useEffect(() => {
    //if user play/paused the song
    if (!roomInfo || !Queue?.status) return;
    if (playState?.state == Queue?.status) return;
    setPlayState({
      state: Queue?.status,
      clientId: roomInfo?.clientId,
    });
    console.log("you change play state to :", Queue?.status);
  }, [Queue?.status]);

  useEffect(() => {
    //if remote user play/paused the song
    if (!roomInfo || !Queue?.status) return;
    if (
      playState?.clientId == roomInfo?.clientId ||
      playState?.state == Queue?.status
    )
      return;
    console.log("remote user changed play state to :", playState?.state);
    setQueue({ type: "STATUS", value: playState?.state });
  }, [playState?.state]);

  return <></>;
}
