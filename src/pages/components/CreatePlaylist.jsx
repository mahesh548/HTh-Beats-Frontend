import { useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import { useInView } from "react-intersection-observer";
import PlaylistNavbar from "./PlaylistNavbar";
import Like from "./Like";

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
  const likeData = {
    id: response?.id,
    type: "entity",
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
            <Like
              isLiked={data.isLiked}
              styleClass="playlistButtonSecondary"
              outlinedSrc={likeOutlined}
              filledSrc={likeFilled}
              likeData={likeData}
            />
            <button className="playlistButtonSecondary">
              <img src={downloadOutlined} />
            </button>
            <button className="playlistButtonSecondary">
              <img src={moreOutlined} />
            </button>
          </div>
          <div>
            {Queue?.playlist?.id == data.id && Queue.status != "pause" ? (
              <button
                className="playlistButton"
                onClick={() => setQueue({ type: "STATUS", value: "pause" })}
              >
                <PauseRounded />
              </button>
            ) : (
              <button
                className="playlistButton"
                onClick={() => play(data.list[0].id)}
              >
                <PlayArrowRounded />
              </button>
            )}
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
