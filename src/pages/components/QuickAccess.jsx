import { useState } from "react";

import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
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
        className={`d-flex w-100 justify-content-${
          open ? "start px-2" : "center"
        }`}
      >
        <button
          className="iconButton text-center"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ArrowBackIos style={{ fontSize: "16px" }} />
          ) : (
            <ArrowForwardIosOutlined style={{ fontSize: "16px" }} />
          )}
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
    </div>
  );
}
