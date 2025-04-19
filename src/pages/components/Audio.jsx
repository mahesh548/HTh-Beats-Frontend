import { useContext, useEffect, useCallback } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import { channelContext } from "./Channel";

export default function Audio() {
  const { Queue, setQueue } = useContext(songContext);
  const { channel, currentSong, roomInfo } = useContext(channelContext);

  const mediaNotification = (mediaData) => {
    if (navigator?.mediaSession) {
      const defaultArtwork = `https://${location.host}/logo.png`;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaData?.title || "",
        artist: mediaData?.artist || "",
        album: mediaData?.album || "",
        artwork: [
          {
            src: mediaData?.img || defaultArtwork,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setQueue({ type: "STATUS", value: "resume" });
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setQueue({ type: "STATUS", value: "pause" });
      });

      navigator.mediaSession.setActionHandler("seekto", (event) => {
        document.getElementById("audio").currentTime = event.seekTime;
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        setQueue({ type: "PREV" });
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        setQueue({ type: "NEXT" });
      });

      navigator.mediaSession.setActionHandler("stop", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
    }
  };

  useEffect(() => {
    const play = () => {
      const audio = document.getElementById("audio");
      const song = utils.getItemFromId(Queue.song, Queue.playlist.list);
      audio.src = utils.decryptor(song.more_info.encrypted_media_url);
      audio.play();
      mediaNotification({
        title: utils.refineText(song?.title || ""),
        artist: utils.refineText(song?.subtitle || ""),
        img: song.image.replace("150x150", "500x500"),
      });
    };

    const pause = () => {
      const audio = document.getElementById("audio");
      audio.pause();
    };
    const resume = () => {
      const audio = document.getElementById("audio");
      audio.play();
    };
    if (Queue.status == "play") {
      play();
    }

    if (Queue.status == "pause") {
      pause();
    }
    if (Queue.status == "resume") {
      resume();
    }
  }, [Queue?.status, Queue?.song]);

  const ended = useCallback(() => {
    if (
      channel &&
      currentSong &&
      roomInfo &&
      currentSong.clientId !== roomInfo.clientId
    )
      return;
    const repeatOne = JSON.parse(localStorage.getItem("repeat")) || false;
    if (repeatOne) {
      document.getElementById("audio").currentTime = 0;
      const audio = document.getElementById("audio");
      audio.play();
    } else {
      setQueue({ type: "NEXT" });
    }
  }, [channel, currentSong, roomInfo, setQueue]);

  return (
    <audio
      src=""
      controls
      autoPlay={false}
      style={{ display: "none" }}
      id="audio"
      onTimeUpdate={utils.timelineUpdater}
      onEnded={() => ended()}
    ></audio>
  );
}
