import { useContext, useEffect, useState } from "react";
import searchOutlined from "../../assets/icons/searchSvgOutlined.svg";
import {
  ArrowBack,
  RadioButtonChecked,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import utils from "../../../utils";
import OffCanvas from "./BottomSheet";
import { HashContext } from "./Hash";

export default function PlaylistNavbar({ response, setData, display }) {
  const [bg, setBg] = useState("#8d8d8d");
  const [isOn, setIsOn] = useState(false);
  const [sorted, setSorted] = useState("default");
  const { open, close, openElements } = useContext(HashContext);

  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(response.image);

      setBg(color ? color : "#8d8d8d");
    };
    if (response.image) {
      setColor();
    }
  }, [response]);

  const searchPlaylist = (e) => {
    if (e.target.value.length == 0) {
      setIsOn(false);
    }
    const filterData = response.list.filter((item) => {
      const substring = e.target.value;
      const regex = new RegExp(`\\b${substring}\\S*`, "i");
      if (regex.test(item.title) || regex.test(item.subtitle)) return item;
    });
    setData({ ...response, list: filterData });
  };
  console.log(openElements);
  const isCanvasOpen = openElements.includes("sort");

  return (
    <>
      <OffCanvas open={isCanvasOpen} dismiss={() => close("sort")}>
        <div className="sortCont">
          <button onClick={() => setSorted("default")}>
            <p>Default</p>
            {sorted == "default" ? (
              <RadioButtonChecked />
            ) : (
              <RadioButtonUncheckedOutlined />
            )}
          </button>
          <button onClick={() => setSorted("artist")}>
            <p>Artist</p>
            {sorted == "artist" ? (
              <RadioButtonChecked />
            ) : (
              <RadioButtonUncheckedOutlined />
            )}
          </button>
          <button onClick={() => setSorted("title")}>
            <p>Title</p>
            {sorted == "title" ? (
              <RadioButtonChecked />
            ) : (
              <RadioButtonUncheckedOutlined />
            )}
          </button>
          <button onClick={() => setSorted("release_date")}>
            <p>Release Date</p>
            {sorted == "release_date" ? (
              <RadioButtonChecked />
            ) : (
              <RadioButtonUncheckedOutlined />
            )}
          </button>
        </div>
      </OffCanvas>
      <div
        className="playlistNavbar"
        style={{
          backgroundColor: bg,
          display: !display || isOn ? "grid" : "none",
        }}
      >
        <button className="iconButton">
          <ArrowBack />
        </button>
        {isOn ? (
          <div className="playlistSearch">
            <input
              type="text"
              placeholder="Search this playlist"
              onInput={(e) => searchPlaylist(e)}
            />
            <button onClick={() => open("sort")}>Sort</button>
          </div>
        ) : (
          <div className="playlistNavbarInfo">
            <p className="thinOneLineText playlistTitle">{response.title}</p>
            <button className="iconButton" onClick={() => setIsOn(true)}>
              <img src={searchOutlined} height={"20px"} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
