import { useContext, useState } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import { useLocation, useNavigate } from "react-router";

export default function MiniPlayer() {
  const { Queue, setQueue } = useContext(songContext);
  const navigate = useNavigate();
  const location = useLocation();
  const setColor = async (url) => {
    const color = await utils.getAverageColor(url, 0.5);
    document.getElementById("miniPlayer").style.backgroundColor = color;
  };
  const togglePlay = () => {
    if (Queue.status == "play" || Queue.status == "resume") {
      setQueue({ type: "STATUS", value: "pause" });
    } else {
      setQueue({ type: "STATUS", value: "resume" });
    }
  };
  const showPlayer = () => {
    navigate(`${location.pathname}#player`);
  };

  const RenderMiniPlayer = () => {
    const data = utils.getItemFromId(Queue.song, Queue.playlist.list);
    setColor(data.image);
    return (
      <div className="playlistSong miniPlayer" id="miniPlayer">
        <img
          src={data.image}
          alt=""
          className="playlistSongImg miniPlayerPoster"
          onClick={() => showPlayer()}
        />
        <div onClick={() => showPlayer()}>
          <p className="thinOneLineText playlistSongTitle">
            {utils.refineText(data.title)}
          </p>
          <p className="thinOneLineText playlistSongSubTitle">
            {data.subtitle?.length != 0
              ? utils.refineText(data.subtitle)
              : utils.refineText(
                  `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                )}
          </p>
        </div>
        <div>
          <button className="miniPlayerButton">
            <img src={likeOutlined} alt="" />
          </button>
        </div>
        <div>
          <button className="miniPlayerButton" onClick={() => togglePlay()}>
            {Queue.status == "pause" ? <PlayArrowRounded /> : <PauseRounded />}
          </button>
        </div>
      </div>
    );
  };
  return Queue?.song && Queue?.playlist ? <RenderMiniPlayer /> : <></>;
}
