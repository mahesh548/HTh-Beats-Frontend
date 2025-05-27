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
import {
  Add,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  ExploreOutlined,
  MusicNote,
} from "@mui/icons-material";

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
import utils from "../../../utils";
import { showToast } from "./showToast";
import SearchHistCard from "./SearchHistCard";

export default function Screen() {
  const auth = useContext(AuthContext);
  const { channel, messages } = useContext(channelContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { openElements, close, open, closeOpen } = useContext(HashContext);
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState(
    new URLSearchParams(location.search).get("q") || ""
  );
  const [historyResult, setHistoryResult] = useState(
    JSON.parse(localStorage?.searched || "[]")
  );

  //to store time difference between key stroke and search
  let searchTimeOut = useRef(null);

  const [Fullscreen, setFullscreen] = useState("none");

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

  const processInput = (value) => {
    setSearchInput(value);
  };

  const updateUrl = (value) => {
    // save search input into url
    const param = new URLSearchParams(location.search);
    if (param.get("open") === "search") {
      param.delete("open");
    }

    if (value.length === 0) {
      param.delete("q");
      navigate(
        `${location.pathname}${
          param.toString().length > 0 ? "?" : ""
        }${param.toString()}`
      );
    } else {
      param.set("q", value);

      navigate(`/search?open=search&${param.toString()}`);
    }
  };

  useEffect(() => {
    // clear old timeout
    clearTimeout(searchTimeOut.current);

    //set new timeout for new stroke
    searchTimeOut.current = setTimeout(() => {
      updateUrl(searchInput);
    }, 1000);
  }, [searchInput]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (!q) {
      setSearchInput("");
    }
  }, [location.search]);

  const removeFromHistory = async (songId, historyId) => {
    const oldHistory = JSON.parse(localStorage?.searched);
    if (oldHistory.length == 0) return;
    if (songId.includes("all")) {
      localStorage.setItem("searched", "[]");
      setHistoryResult([]);

      await utils.BACKEND(`/activity`, "DELETE", {
        deleteData: { historyIds: ["all"], type: "search", idList: ["all"] },
      });
      showToast({
        text: "Cleared recent searches",
      });
      return;
    }
    const newHistory = oldHistory.filter(
      (item) => !(item.id === songId[0] && item.historyId === historyId[0])
    );
    localStorage.setItem("searched", JSON.stringify(newHistory));
    setHistoryResult(newHistory);

    await utils.BACKEND(`/activity`, "DELETE", {
      deleteData: { historyIds: historyId, type: "search", idList: songId },
    });
  };

  const isActive = (path) => location.pathname === path;
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

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
          style={{
            gridTemplateColumns: isPWA ? "80px auto 1fr auto" : "80px 1fr auto",
          }}
        >
          <div
            className="d-grid justify-content-center align-content-center"
            title="HTh Beats"
          >
            <img src="/logo.png" height="40px" width="40px" />
          </div>
          {isPWA && (
            <div className="d-flex">
              <button
                className="iconButton op-80"
                onClick={() => navigate(-1)}
                title="Go back"
              >
                <ArrowBackIos />
              </button>
              <button
                className="iconButton op-80"
                onClick={() => navigate(1)}
                title="Go forward"
              >
                <ArrowForwardIos />
              </button>
            </div>
          )}
          <div className="d-flex justify-content-center">
            <button
              className="iconButton desk-navbtn"
              onClick={() => navigate("/home")}
              title="Home"
            >
              <img
                src={isActive("/home") ? homeSvgFilled : homeSvgOutlined}
                className={isActive("/home") ? "" : "op-80"}
              />
            </button>
            <div className="deskSrchBox ">
              <button className="iconButton op-80" title="Search">
                <img src={searchSvgOutlined} height={"25px"} />
              </button>
              <div
                className="d-flex"
                style={{ borderRight: "1px solid #ffffff24" }}
              >
                <input
                  type="search"
                  placeholder="Hey, what do you want to listen?"
                  className="srchInput w-100"
                  value={searchInput}
                  onInput={(e) => processInput(e.target.value)}
                  spellCheck={false}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateUrl(e.target.value);
                    }
                  }}
                />
                {searchInput.length > 0 && (
                  <button
                    className="iconButton op-80"
                    onClick={() => setSearchInput("")}
                    title="Clear"
                  >
                    <Close />
                  </button>
                )}
              </div>
              <button
                className="iconButton op-80"
                onClick={() => navigate("/search")}
                title="Explore"
              >
                <ExploreOutlined />
              </button>
              {historyResult.length > 0 &&
                isFocused &&
                searchInput.length == 0 && (
                  <div
                    className="deskHist"
                    onMouseDown={(e) => {
                      // optional: prevent blur
                      e.preventDefault();
                    }}
                  >
                    <>
                      <p className="labelText ps-2">Recent searches</p>
                      <div className="px-2 pb-3">
                        {historyResult.map((item, index) => {
                          return (
                            <SearchHistCard
                              data={item}
                              removeFromHistory={removeFromHistory}
                              key={`history_${index}`}
                            />
                          );
                        })}
                        <button
                          className="addToBut mt-4 p-1 px-3"
                          style={{
                            background: "transparent",
                            color: "white",
                            border: "2px solid gray",
                          }}
                          onClick={() => removeFromHistory(["all"], ["all"])}
                        >
                          Clear recent searches
                        </button>
                      </div>
                    </>
                  </div>
                )}
            </div>
          </div>
          <div
            className="d-flex align-items-center pe-2"
            style={{ gap: "20px" }}
          >
            {!isPWA &&
              (!window.PWAinstallable ? (
                <></>
              ) : (
                <button
                  className="iconButton d-flex op-80 align-items-center"
                  style={{ gap: "5px" }}
                  onClick={() => open("Install")}
                >
                  <img src={downloadOutlined} height="20px" />
                  Install App
                </button>
              ))}

            <Link to="/profile">
              <img
                src={auth?.user?.pic || "logo.png"}
                className="rounded-circle"
                height="35px"
                style={{ border: "5px solid #ffffff38" }}
                title={`${auth?.user?.username || "Profile"}`}
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
