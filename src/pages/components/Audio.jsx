import { useContext, useEffect } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";

export default function Audio() {
  const { Queue } = useContext(songContext);

  useEffect(() => {
    const play = () => {
      const audio = document.getElementById("audio");
      const song = utils.getItemFromId(Queue.song, Queue.playlist.list);
      console.log(song);
      audio.src = utils.decryptor(song.more_info.encrypted_media_url);
      audio.play();
    };
    if (Queue?.song && Queue?.playlist) {
      play();
    }
  }, [Queue]);
  return (
    <audio
      src=""
      controls
      autoPlay={false}
      style={{ display: "none" }}
      id="audio"
    ></audio>
  );
}
