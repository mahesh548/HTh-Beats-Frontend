import { useNavigate, Outlet, Link, useLocation } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";

//icons
import homeSvgFilled from "../../assets/icons/homeSvgFilled.svg";
import homeSvgOutlined from "../../assets/icons/homeSvgOutlined.svg";
import searchSvgFilled from "../../assets/icons/searchSvgFilled.svg";
import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import librarySvgFilled from "../../assets/icons/librarySvgFilled.svg";
import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
import roomFilled from "../../assets/icons/roomFilled.svg";
import roomFilledActive from "../../assets/icons/roomFilledActive.svg";
import { Add, MusicNote } from "@mui/icons-material";

import Audio from "./Audio";
import MiniPlayer from "./MiniPlayer";
import Player from "./Player";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import { createPortal } from "react-dom";
import MakePlaylist from "./MakePlaylist";
import MakeRoom from "./MakeRoom";
import RealtimeSong from "./RealtimeSong";
import { channelContext } from "./Channel";
import ChangeLang from "./ChangeLang";

export default function Screen() {
  const auth = useContext(AuthContext);
  const { channel, messages } = useContext(channelContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { openElements, close, open, closeOpen } = useContext(HashContext);
  const [badge, setBadge] = useState(false);
  const messageCounts = useRef(0);
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      console.log(isAuth);
      if (!isAuth) {
        localStorage.clear();
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!channel || !messages) return;
    if (location.pathname === "/room") setBadge(false);
    if (messages?.length != messageCounts.current)
      setBadge(location.pathname !== "/room");
    messageCounts.current = messages?.length;
  }, [channel, messages, location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Audio />
      <RealtimeSong />
      <ChangeLang />
      <MiniPlayer />
      <div className="screen">
        <div className="screenNavbar p-2">
          <div className="d-grid justify-content-center">
            <img src="/logo.png" height="50px" width="50px" />
          </div>
          <div></div>
          <div></div>
        </div>
        <div className="screenMain p-2">
          <div className="sidePanel"></div>
          <div className="screenPage hiddenScrollbar ps-4">
            <Outlet />
          </div>
        </div>
        <div className="screenBottomBar"></div>
      </div>

      {/* {openElements.includes("createPlaylist") &&
        createPortal(<MakePlaylist type={"viewOnly"} />, document.body)}
      {openElements.includes("createRoom") &&
        createPortal(<MakeRoom />, document.body)} */}
    </>
  );
}
