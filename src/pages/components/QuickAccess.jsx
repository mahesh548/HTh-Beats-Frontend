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
        style={{ width: "90%" }}
      >
        <button
          className="iconButton text-center"
          onClick={() => setOpen(!open)}
        >
          {open ? <img src={PanelOpen} /> : <img src={PanelOpen} />}
        </button>
        <p className="labelText m-0">Quick access</p>
      </div>

      <button className="iconButton qaButton">
        <Add />
        <p>Create</p>
      </button>
      <button className="iconButton qaButton">
        <img src={librarySvgOutlined} />
        <p>Your library</p>
      </button>
      <hr className="dividerLine op-10 m-0" />
      <button className="iconButton qaList">
        <img src="./Like.png" />
        <p>Like Songs</p>
      </button>
    </div>
  );
}
