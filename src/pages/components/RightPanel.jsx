import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { songContext } from "./Song";
import {
  ChevronLeftRounded,
  FormatQuoteRounded,
  MoreHorizOutlined,
  MoreHorizRounded,
  MoreVertOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  RepeatOneOutlined,
  RepeatOutlined,
  ShareOutlined,
  SkipNextRounded,
  SkipPreviousRounded,
  ZoomInMapOutlined,
  ZoomOutMapOutlined,
  ZoomOutOutlined,
} from "@mui/icons-material";
import utils from "../../../utils";

import downloadOutlined from "../../assets/icons/downloadOutlinedPlayer.svg";
import playlistOutlined from "../../assets/icons/playlistOutlined.svg";
import PanelOpen from "../../assets/icons/PanelOpen.svg";
import LikeSong from "./LikeSong";
import { HashContext } from "./Hash";
import QueuePage from "./QueuePage";
import SwipeableViews from "react-swipeable-views";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import OptionSong from "./OptionSong";
import OffCanvas from "./BottomSheet";
import BackButton from "./BackButton";
import { showToast } from "./showToast";

export default function RightPanel({ Fullscreen, setFullscreen }) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen, closeAll } =
    useContext(HashContext);
  const [localLike, setLocalLike] = useState(false);

  const lyrics = useRef({
    data: ["Lyrics not available for this track!"],
    id: null,
  });

  const toggleRightPanel = (type) => {
    const allTypes = ["player", "queue", "lyrics"];
    setFullscreen("none");
    if (openElements.includes(type)) {
      closeAll(allTypes);
      return;
    }
    if (openElements.some((ele) => allTypes.includes(ele))) {
      allTypes.forEach((ele) => {
        if (openElements.includes(ele)) {
          closeOpen(ele, type);
        }
      });
    } else {
      open(type);
    }
  };

  const closePlayer = () => {
    toggleRightPanel("player");
  };
  if (Queue?.song == undefined && openElements.includes("player")) {
    closeAll(["player", "queue", "lyrics"]);
  }

  const data = useMemo(() => {
    if (Queue.song && Queue.playlist) {
      return utils.getItemFromId(Queue?.song, Queue?.playlist?.list);
    }
  }, [Queue?.song, Queue?.playlist]);

  useEffect(() => {
    if (
      data &&
      data.image &&
      (openElements.includes("player") || openElements.includes("lyrics"))
    ) {
      setColor(data.image);
    }
  }, [data?.image, openElements]);

  const likeData = useMemo(() => {
    if (!Queue.song) return null;
    const playlistPreference = localStorage?.preferedPlaylist;
    if (playlistPreference) {
      return {
        type: "song",
        id: [Queue.song],
        playlistIds: JSON.parse(playlistPreference),
      };
    }
    return null;
  }, [Queue?.song]);

  const addId = useMemo(() => {
    return Queue.song
      ? `add_${Queue?.song}_${Math.random().toString(36).substr(2, 9)}`
      : "";
  }, [Queue?.song]);

  useEffect(() => {
    if (data?.savedIn && data.savedIn.length > 0) {
      setLocalLike(true);
    } else {
      setLocalLike(false);
    }
  }, [data?.savedIn, Queue?.song]);

  const getLyrics = async (snippet, id) => {
    if (snippet == "No Lyrics") {
      showToast({ text: "Lyrics not available" });
      return;
    }

    if (lyrics.current?.id == id && lyrics.current.data.length > 2) {
      console.log("toggling the panel");
      toggleRightPanel("lyrics");
      return;
    }
    if (lyrics.current.id == id) {
      showToast({ text: "Fetching lyrics..." });
      return;
    }

    lyrics.current.id = id;
    lyrics.current.data = ["Lyrics not available for this track!"];

    const response = await utils.API(`/lyrics?id=${id}`, "GET");
    if (response.status) {
      const lyricArray = response.lyrics.split("<br>");
      lyrics.current = { data: lyricArray, id: id };
      console.log("togglint the panel");
      toggleRightPanel("lyrics");
    }
  };

  const setColor = async (url) => {
    const color = await utils.getAverageColor(url, 0.5);
    document
      .getElementById("desk-player")
      ?.style?.setProperty("background-color", color);
    document
      .getElementById("desk-lyrics")
      ?.style?.setProperty("background-color", color);
    document
      .getElementById("desk-lyrics-nav")
      ?.style?.setProperty("background-color", color);
  };

  useEffect(() => {
    if (!data?.id) return;
    const lyricsBtn = document.getElementById("lyricsBtn");

    const handleClick = () => {
      getLyrics(data.more_info?.lyrics_snippet || "No Lyrics", data.id);
    };

    if (lyricsBtn) {
      lyricsBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (lyricsBtn) {
        lyricsBtn.removeEventListener("click", handleClick);
      }
    };
  }, [data?.id, openElements]);

  const switchFullscreen = (element) => {
    setFullscreen(element);
    if (document.body?.requestFullscreen) {
      document.body.requestFullscreen();
    }
  };

  if (Queue.song == undefined) {
    return <></>;
  }

  return (
    <>
      {openElements.includes("player") && (
        <div className="desk-player px-2" id="desk-player">
          <div
            className={`${
              Fullscreen !== "player" ? "desk-playerNav" : "desk-playerNav-full"
            }`}
          >
            <button
              className={`iconButton opacity-50 ${
                Fullscreen == "player" && "d-none"
              } `}
              onClick={() => closePlayer()}
            >
              <img src={PanelOpen} style={{ transform: "scaleX(-1)" }} />
            </button>
            <div>
              <b className="thinOneLineText text-white-50 fw-bold">
                {Queue.playlist.title}
              </b>
            </div>
            <OptionSong
              styleClass=""
              data={data}
              likeData={likeData}
              addId={addId}
            >
              <MoreHorizOutlined className="iconButton opacity-50" />
            </OptionSong>
            {Fullscreen !== "player" ? (
              <button
                className="iconButton opacity-50 w-100 desk"
                onClick={() => switchFullscreen("player")}
              >
                <ZoomOutMapOutlined style={{ height: "18px" }} />
              </button>
            ) : (
              <button
                className="iconButton opacity-50 w-100 desk"
                onClick={() => setFullscreen("none")}
              >
                <ZoomInMapOutlined style={{ height: "18px" }} />
              </button>
            )}
          </div>

          <div className="bannerWrapper">
            <img
              src={utils
                .getItemFromId(Queue.song, Queue.playlist.list)
                .image.replace("150x150", "500x500")}
              alt={data.title}
              className="playerBanner"
            />
          </div>
          <div
            className={`playerDetails ${Fullscreen == "player" && "d-none"}`}
          >
            <div>
              <p className="thinOneLineText playerTitle fs-5">
                {utils.refineText(data.title)}
              </p>
              <p className="thinOneLineText playerSubtitle">
                {data.subtitle?.length != 0
                  ? utils.refineText(data.subtitle)
                  : utils.refineText(
                      `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                    )}
              </p>
            </div>

            <LikeSong
              styleClass="desk-playerDetailsButton"
              isLiked={localLike}
              likeData={likeData}
              addId={addId}
              key={`playerLike_${data.id}`}
            />
          </div>
        </div>
      )}
      {openElements.includes("queue") && <QueuePage />}

      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={data.savedIn || []}
            results={(obj) => setLocalLike(obj.savedTo.length > 0)}
            eleId={addId}
          />,
          document.body
        )}
      {openElements.includes("lyrics") && (
        <div
          className="queuePageLayout"
          id="desk-lyrics"
          style={{ minWidth: "300px" }}
        >
          <div className="navbarAddTo px-1 mt-1" id="desk-lyrics-nav">
            {Fullscreen !== "lyrics" && (
              <button
                className="iconButton opacity-50 w-100 desk"
                onClick={() => toggleRightPanel("lyrics")}
              >
                <img
                  src={PanelOpen}
                  className="w-100"
                  style={{ transform: "scaleX(-1)" }}
                />
              </button>
            )}
            <div
              className={`${
                Fullscreen == "lyrics" ? "text-start" : "text-center"
              } w-100`}
            >
              <p className="thinOneLineText" style={{ fontSize: "1rem" }}>
                {utils.refineText(data.title)}
              </p>
              <p
                className="thinOneLineText text-white-50"
                style={{ fontSize: "0.8rem" }}
              >
                {data.subtitle?.length != 0
                  ? utils.refineText(data.subtitle)
                  : utils.refineText(
                      `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                    )}
              </p>
            </div>
            {Fullscreen !== "lyrics" ? (
              <button
                className="iconButton opacity-50 w-100 desk"
                onClick={() => switchFullscreen("lyrics")}
              >
                <ZoomOutMapOutlined style={{ height: "18px" }} />
              </button>
            ) : (
              <button
                className="iconButton opacity-50 w-100 desk"
                onClick={() => setFullscreen("none")}
              >
                <ZoomInMapOutlined style={{ height: "18px" }} />
              </button>
            )}
          </div>
          <div className="hiddenScrollbar deskScroll">
            {lyrics.current.data.map((line, index) => {
              if (line.length == 0) {
                return (
                  <div key={"lyrics-line-" + index} className="mt-4 mb-2"></div>
                );
              }
              return (
                <p
                  key={"lyrics-line-" + index}
                  className={`text-white  fw-normal mt-2 mb-2 px-2 ps-3 lyricalText`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
