import { useNavigate, Outlet, Link, useLocation } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";

//icons

import searchSvgFilled from "../../assets/icons/searchSvgFilled.svg";
import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import librarySvgFilled from "../../assets/icons/librarySvgFilled.svg";
import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
import roomFilled from "../../assets/icons/roomFilled.svg";
import roomFilledActive from "../../assets/icons/roomFilledActive.svg";
import { Add, ExploreOutlined, MusicNote } from "@mui/icons-material";

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
import DeskPlayer from "./DeskPlayer";
import Library from "../Library";
import QuickAccess from "./QuickAccess";
import RightPanel from "./RightPanel";
//icons
import homeSvgFilled from "../../assets/icons/homeSvgFilled.svg";
import homeSvgOutlined from "../../assets/icons/homeSvgOutlined.svg";

export default function Screen() {
  const auth = useContext(AuthContext);
  const { channel, messages } = useContext(channelContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { openElements, close, open, closeOpen } = useContext(HashContext);

  const [Fullscreen, setFullscreen] = useState("none");

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Audio />
      <RealtimeSong />
      <ChangeLang />

      <div className={`${Fullscreen !== "none" ? "fullScreen" : "screen"}`}>
        <div
          className={`screenNavbar p-2 pb-0 ${
            Fullscreen !== "none" && "d-none"
          }`}
        >
          <div className="d-grid justify-content-center align-content-center">
            <img src="/logo.png" height="40px" width="40px" />
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="iconButton desk-navbtn"
              onClick={() => navigate("/home")}
            >
              <img
                src={isActive("/home") ? homeSvgFilled : homeSvgOutlined}
                className={isActive("/home") ? "" : "op-80"}
              />
            </button>
            <div className="deskSrchBox ">
              <button className="iconButton op-80">
                <img
                  src={
                    isActive("/search") ? searchSvgFilled : searchSvgOutlined
                  }
                  height={"25px"}
                />
              </button>
              <div className="inputBox"></div>
              <button
                className="iconButton op-80"
                onClick={() => navigate("/search")}
              >
                <ExploreOutlined />
              </button>
            </div>
          </div>
          <div
            className="d-flex align-items-center pe-2"
            style={{ gap: "10px" }}
          >
            <button className="iconButton d-flex op-80" style={{ gap: "5px" }}>
              <img src={downloadOutlined} height="25px" />
              Install App
            </button>

            <Link to="/profile">
              <img
                src={auth?.user?.pic || "logo.png"}
                className="rounded-circle"
                height="35px"
              />
            </Link>
          </div>
        </div>
        <div
          className={`${
            Fullscreen !== "none" ? "fullScreenMain" : "screenMain"
          } p-2`}
        >
          <div
            className={`sidePanel hiddenScrollbar ${
              Fullscreen !== "none" && "d-none"
            }`}
          >
            <QuickAccess />
          </div>
          <div
            className={`screenPage hiddenScrollbar ${
              Fullscreen !== "none" && "d-none"
            }`}
          >
            <Outlet />
          </div>
          <div
            className={` hiddenScrollbar ${
              Fullscreen !== "none" ? "fullScreenRightPanel" : "rightPanel"
            }`}
          >
            <RightPanel Fullscreen={Fullscreen} setFullscreen={setFullscreen} />
          </div>
        </div>
        <div className="screenBottomBar">
          {<DeskPlayer setFullscreen={setFullscreen} />}
        </div>
      </div>

      <OffCanvas
        open={openElements.includes("createOption")}
        dismiss={() => close("createOption")}
      >
        <button
          className="iconButton playlistSong createButtons"
          onClick={() => closeOpen("createOption", "createRoom")}
        >
          <img src={roomFilled} />
          <div className="text-start">
            <p className="text-start">Music Room</p>
            <p className="thinOneLineText">
              Create a room and enjoy music with your friends.
            </p>
          </div>
        </button>
        <button
          className="iconButton playlistSong createButtons"
          onClick={() => closeOpen("createOption", "createPlaylist")}
        >
          <MusicNote />
          <div className="text-start">
            <p className="text-start">Playlist</p>
            <p className="thinOneLineText">
              Build a playlist with your favorite songs.
            </p>
          </div>
        </button>
      </OffCanvas>

      {openElements.includes("createPlaylist") &&
        createPortal(<MakePlaylist type={"viewOnly"} />, document.body)}
      {openElements.includes("createRoom") &&
        createPortal(<MakeRoom />, document.body)}
    </>
  );
}
