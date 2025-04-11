import { useContext, useEffect } from "react";
import { channelContext } from "./Channel";
import { songContext } from "./Song";
import utils from "../../../utils";

export default function RealtimeSong() {
  const { currentSong, setCurrentSong, roomInfo, playState, setPlayState } =
    useContext(channelContext);
  const { Queue, setQueue } = useContext(songContext);

  const playThisSong = async (songId) => {
    const response = await utils.API(`/song?id=${songId}`, "GET");

    if (response.hasOwnProperty("more_info")) {
      const oldList = Queue?.playlist?.list || [];
      const oldId = Queue?.playlist?.id || response.id;
      const oldType = Queue?.playlist?.type || "song";
      const playlistEcho = {
        id: oldId,
        title: roomInfo?.title,
        type: oldType,
        list: [response, ...oldList.filter((item) => item.perma_url != songId)],
      };
      setQueue({
        type: "NEW",
        value: { playlist: playlistEcho, song: response.id, status: "play" },
      });
    }
  };

  useEffect(() => {
    //if remote user played the song
    if (!currentSong || !roomInfo) return;
    if (currentSong?.clientId == roomInfo?.clientId) return;
    playThisSong(currentSong?.songId);
    console.log("song played by: ", currentSong.clientId);
  }, [currentSong?.songId]);

  useEffect(() => {
    //if user played the song
    if (!roomInfo) return;
    if (!currentSong) {
      const songId = Queue.playlist.list.find(
        (item) => item.id == Queue.song
      ).perma_url;
      setCurrentSong({
        songId: songId,
        clientId: roomInfo?.clientId,
      });
      return;
    }
    if (
      currentSong?.clientId == roomInfo?.clientId &&
      currentSong?.songId == Queue?.song
    )
      return;

    const songId = Queue.playlist.list.find(
      (item) => item.id == Queue.song
    ).perma_url;
    setCurrentSong({
      songId: songId,
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
