import { useEffect, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PlayArrow, PlayArrowRounded } from "@mui/icons-material";
export default function CreatePlaylist({ data }) {
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
  return (
    <div className="page hiddenScrollbar">
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>
      <div className="playlistMain">
        <BackButton />
        <img src={data.image} alt={data.title} className="playlistMainImg" />
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
    </div>
  );
}
