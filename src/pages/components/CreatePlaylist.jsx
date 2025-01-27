import { useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PlayArrowRounded } from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import { useInView } from "react-intersection-observer";
import PlaylistNavbar from "./PlaylistNavbar";

export default function CreatePlaylist({ response }) {
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");
  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(data.image);

      setBg(color ? color : "#8d8d8d");
    };
    if (data.image) {
      setColor();
    }
  }, [data]);

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };
  const more_opt = (id) => {
    console.log("more");
  };
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>
      <div className="playlistMain">
        <PlaylistNavbar
          response={response}
          setData={setData}
          display={inView}
        />

        <BackButton />
        <img
          src={data.image}
          alt={data.title}
          className="playlistMainImg"
          ref={ref}
        />
        <div className="playlistDetails">
          <p className="thinTwoLineText">
            {utils.refineText(data.header_desc)}
          </p>
          <div className="playlistOwnersDetails">
            <img src="../logo.png" alt="playlist owner" />
            <p>Beats</p>
          </div>
          <p className="thinTwoLineText">
            {utils.refineText(data.more_info?.subtitle_desc.join(" • "))}
          </p>
        </div>
        <div className="playlistButtonCont">
          <div>
            <button className="playlistButtonSecondary">
              <img src={likeOutlined} alt="" />
            </button>
            <button className="playlistButtonSecondary">
              <img src={downloadOutlined} alt="" />
            </button>
            <button className="playlistButtonSecondary">
              <img src={moreOutlined} alt="" />
            </button>
          </div>
          <div>
            <button className="playlistButton">
              <PlayArrowRounded />
            </button>
          </div>
        </div>
      </div>
      <div className="songList">
        {data.list.map((item) => {
          return (
            <PlaylistSong
              data={item}
              play={play}
              more_opt={more_opt}
              key={item.id}
              isPlaying={item.id == Queue.song}
            />
          );
        })}
      </div>
    </div>
  );
}
