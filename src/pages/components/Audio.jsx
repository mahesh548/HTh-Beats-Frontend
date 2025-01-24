import { useContext, useEffect } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";

export default function Audio() {
  const { Queue } = useContext(songContext);

  useEffect(() => {
    const play = () => {
      const audio = document.getElementById("audio");
      const song = utils.getItemFromId(Queue.song, Queue.playlist.list);
      audio.src = utils.decryptor(song.more_info.encrypted_media_url);
      audio.play();
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

  return (
    <audio
      src=""
      controls
      autoPlay={false}
      style={{ display: "none" }}
      id="audio"
      onTimeUpdate={utils.timelineUpdater}
    ></audio>
  );
}
