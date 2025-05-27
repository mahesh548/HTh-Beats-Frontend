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

export default function Navbar() {
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

      {openElements.includes("player") && <Player />}
      <OffCanvas
        open={openElements.includes("createOption")}
        dismiss={() => close("createOption")}
      >
        <button className="iconButton playlistSong createButtons">
          <img src={roomFilled} />
          <div>
            <p
              className="text-start"
              onClick={() => closeOpen("createOption", "createRoom")}
            >
              Music Room
            </p>
            <p className="thinOneLineText">
              Create a room and enjoy music with your friends.
            </p>
          </div>
        </button>
        <button className="iconButton playlistSong createButtons">
          <MusicNote />
          <div>
            <p
              className="text-start"
              onClick={() => closeOpen("createOption", "createPlaylist")}
            >
              Playlist
            </p>
            <p className="thinOneLineText">
              Build a playlist with your favorite songs.
            </p>
          </div>
        </button>
      </OffCanvas>
      <MiniPlayer />

      <div className="navBOTTOM">
        <Link to="/home">
          <div className="navBTN">
            <button className="pop">
              <img src={isActive("/home") ? homeSvgFilled : homeSvgOutlined} />
              <p className="menuLab">Home</p>
            </button>
          </div>
        </Link>
        <Link to="/search">
          <div className="navBTN">
            <button className="pop">
              <img
                src={isActive("/search") ? searchSvgFilled : searchSvgOutlined}
                className="pop"
              />
              <p className="menuLab">Search</p>
            </button>
          </div>
        </Link>

        {!channel ? (
          <div className="navBTN">
            <button className="pop" onClick={() => open("createOption")}>
              <Add className="pop" />
              <p className="menuLab">Create</p>
            </button>
          </div>
        ) : (
          <Link to="/room">
            <div className="navBTN">
              <button className="pop">
                {badge && (
                  <span
                    className="position-absolute p-1 bg-danger rounded-circle"
                    style={{ right: "25px", zIndex: "1" }}
                  ></span>
                )}
                <img src={roomFilledActive} className="pop" />
                <p className="menuLab">Room</p>
              </button>
            </div>
          </Link>
        )}
        <Link to="library">
          <div className="navBTN">
            <button className="pop">
              <img
                className="pop"
                src={
                  isActive("/library") ? librarySvgFilled : librarySvgOutlined
                }
              />
              <p className="menuLab">Library</p>
            </button>
          </div>
        </Link>
        <Link to="profile">
          <div className="navBTN">
            <button className="pop">
              <img
                src={
                  auth?.user?.pic ||
                  "https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png"
                }
                className="navBottomProfilePicture pop"
                alt="porfile picture"
              />
              <p className="menuLab">Profile</p>
            </button>
          </div>
        </Link>
      </div>
      {openElements.includes("createPlaylist") &&
        createPortal(<MakePlaylist type={"viewOnly"} />, document.body)}
      {openElements.includes("createRoom") &&
        createPortal(<MakeRoom />, document.body)}

      <Outlet />
    </>
  );
}
