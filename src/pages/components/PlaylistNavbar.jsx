import { useEffect, useState } from "react";
import searchOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { ArrowBack } from "@mui/icons-material";
import utils from "../../../utils";
export default function PlaylistNavbar({
  response,
  setData,
  title,
  src,
  display,
}) {
  const [bg, setBg] = useState("#8d8d8d");
  const [isOn, setIsOn] = useState(false);
  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(src);

      setBg(color ? color : "#8d8d8d");
    };
    if (src) {
      setColor();
    }
  }, [response]);

  return (
    <div
      className="playlistNavbar"
      style={{ backgroundColor: bg, display: display ? "none" : "grid" }}
    >
      <button className="iconButton">
        <ArrowBack />
      </button>
      {isOn ? (
        <div className="playlistSearch">
          <input type="text" placeholder="Search this playlist" />
          <button>Sort</button>
        </div>
      ) : (
        <div className="playlistNavbarInfo">
          <p className="thinOneLineText playlistTitle">{title}</p>
          <button className="iconButton" onClick={() => setIsOn(true)}>
            <img src={searchOutlined} height={"20px"} />
          </button>
        </div>
      )}
    </div>
  );
}
