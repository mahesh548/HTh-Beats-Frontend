import { useEffect, useState } from "react";
import searchOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { ArrowBack } from "@mui/icons-material";
import utils from "../../../utils";
export default function PlaylistNavbar({ response, setData, title, src }) {
  const [bg, setBg] = useState("#8d8d8d");
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
    <div className="playlistNavbar" style={{ backgroundColor: bg }}>
      <button className="iconButton">
        <ArrowBack />
      </button>
      <p className="thinOneLineText playlistTitle">{title}</p>
      <button className="iconButton">
        <img src={searchOutlined} height={"20px"} />
      </button>
    </div>
  );
}
