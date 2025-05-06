import { useState } from "react";

import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
import PanelOpen from "../../assets/icons/PanelOpen.svg";
import {
  Add,
  ArrowBackIos,
  ArrowForwardIosOutlined,
  SwipeLeft,
} from "@mui/icons-material";

export default function QuickAccess() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`quickCont ${open ? "open" : "closed"}`}>
      <div
        className={`d-flex  justify-content-${open ? "start" : "center"}`}
        style={{ width: "90%", gap: "5px" }}
      >
        <button
          className="iconButton text-center opacity-50"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <img src={PanelOpen} style={{ scale: "0.8" }} />
          ) : (
            <img
              src={PanelOpen}
              style={{ transform: "scaleX(-1)", scale: "0.9" }}
            />
          )}
        </button>
        <p className="labelText m-0">Quick access</p>
      </div>
      <hr className="dividerLine op-10 m-0" />
      <button className="iconButton qaButton">
        <Add />
        <p>Create</p>
      </button>
      <button className="iconButton qaButton">
        <img src={librarySvgOutlined} />
        <p>Your library</p>
      </button>
      <hr className="dividerLine op-10 m-0" />

      <button className="qaList">
        <img src="/Like.png" />
        <div>
          <p className="thinOneLineText playlistSongTitle text-start">
            Like Songs
          </p>
          <p className="thinOneLineText playlistSongSubTitle">
            Private playlist
          </p>
        </div>
      </button>
    </div>
  );
}
