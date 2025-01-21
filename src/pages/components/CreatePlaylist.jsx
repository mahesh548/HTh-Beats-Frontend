import { useEffect, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";
export default function CreatePlaylist({ data }) {
  const [bg, setBg] = useState("#8d8d8d");
  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(data.image);
      console.log(color);
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
        <img src={data.image} alt={data.title} />
        <p className="thinTwoLineText">{data.title}</p>
      </div>
    </div>
  );
}
