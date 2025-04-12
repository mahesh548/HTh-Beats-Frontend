import { useContext, useEffect } from "react";
import { channelContext } from "./Channel";
import { songContext } from "./Song";
import utils from "../../../utils";

export default function RealtimeSong() {
  const {
    currentSong,
    setCurrentSong,
    roomInfo,
    playState,
    setPlayState,
    members,
    defaultUser,
  } = useContext(channelContext);
  const { Queue, setQueue } = useContext(songContext);

  const playThisSong = async (songId, subtitle) => {
    const response = await utils.API(`/song?id=${songId}`, "GET");

    if (response.hasOwnProperty("more_info")) {
      const oldList = Queue?.playlist?.list || [];
      const oldId = Queue?.playlist?.id || response.id;
      const oldType = Queue?.playlist?.type || "song";
      response.subtitle = `${subtitle}, ${response.subtitle}`;
      const playlistEcho = {
        id: oldId,
        title: roomInfo?.title,
        type: oldType,
        list: [response, ...oldList.filter((item) => item.perma_url != songId)],
      };
      setQueue({
        type: "REMOTE_NEW",
        value: { playlist: playlistEcho, song: response.id, status: "play" },
      });
    }
  };

  useEffect(() => {
    //if remote user played the song
    if (!currentSong || !roomInfo) return;
    if (currentSong?.clientId != roomInfo?.clientId) {
      const remoteUsername =
        members.find((item) => item.clientId == currentSong?.clientId)
          ?.username || defaultUser.username;
      const subtitle = `Played by ${remoteUsername}`;
      playThisSong(currentSong?.songId, subtitle);
    }
  }, [currentSong?.songId]);

  useEffect(() => {
    //if user played the song
    if (!roomInfo || !Queue?.song) return;
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
    if (Queue.isLocal == true && Queue?.song != currentSong?.songId) {
      const songId = Queue.playlist.list.find(
        (item) => item.id == Queue.song
      ).perma_url;
      setCurrentSong({
        songId: songId,
        clientId: roomInfo?.clientId,
      });
    }
  }, [Queue?.song]);

  useEffect(() => {
    //if user play/paused the song
    if (!roomInfo || !Queue?.status) return;
    if (playState?.state == Queue?.status) return;
    setPlayState({
      state: Queue?.status,
      clientId: roomInfo?.clientId,
    });
  }, [Queue?.status]);

  useEffect(() => {
    //if remote user play/paused the song
    if (!roomInfo || !Queue?.status) return;
    if (
      playState?.clientId == roomInfo?.clientId ||
      playState?.state == Queue?.status
    )
      return;

    setQueue({ type: "STATUS", value: playState?.state });
  }, [playState?.state]);

  return <></>;
}
