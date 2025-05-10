import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { songContext } from "./Song";
import {
  ChevronLeftRounded,
  FormatQuoteRounded,
  MoreHorizRounded,
  PauseCircleFilled,
  PlayCircleFilled,
  RepeatOneOutlined,
  RepeatOutlined,
  ShareOutlined,
  SkipNextRounded,
  SkipPreviousRounded,
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

export default function RightPanel() {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const [localLike, setLocalLike] = useState(false);

  const lyrics = useRef({
    data: ["Lyrics not available for this track!"],
    id: null,
  });

  const closePlayer = () => {
    close("player");
  };
  if (Queue?.song?.length == undefined) {
    closePlayer();
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

  if (Queue.song == undefined) {
    return <></>;
  }

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
    document
      .getElementById("desk-lyrics-nav")
      ?.style?.setProperty("box-shadow", `0px 5px 5px ${color}`);
  };

  useEffect(() => {
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
  }, [data.id, openElements]);

  const toggleRightPanel = (type) => {
    const allTypes = ["player", "queue", "lyrics"];
    if (openElements.includes(type)) {
      close(type);
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

  return (
    <>
      {openElements.includes("player") && (
        <div className="desk-player px-2" id="desk-player">
          <div className="desk-playerNav">
            <button
              className="iconButton opacity-50"
              onClick={() => closePlayer()}
            >
              <img src={PanelOpen} style={{ transform: "scaleX(-1)" }} />
            </button>
            <div>
              <b
                className="thinOneLineText"
                style={{ color: "white", fontWeight: "bold" }}
              >
                {Queue.playlist.title}
              </b>
            </div>
            <OptionSong
              styleClass=""
              data={data}
              likeData={likeData}
              addId={addId}
            >
              <MoreHorizRounded />
            </OptionSong>
          </div>

          <img
            src={utils
              .getItemFromId(Queue.song, Queue.playlist.list)
              .image.replace("150x150", "500x500")}
            alt={data.title}
            className="playerBanner"
          />

          <div className="playerDetails">
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
        <div className="queuePageLayout" id="desk-lyrics">
          <div className="navbarAddTo" id="desk-lyrics-nav">
            <button
              className="iconButton opacity-50 w-100 desk"
              onClick={() => close("queue")}
            >
              <img
                src={PanelOpen}
                className="w-100"
                style={{ transform: "scaleX(-1)" }}
              />
            </button>
            <div className="text-center ">
              <p className="thinOneLineText playlistSongTitle fs-5">
                {utils.refineText(data.title)}
              </p>
              <p className="thinOneLineText playlistSongSubTitle fs-6">
                {data.subtitle?.length != 0
                  ? utils.refineText(data.subtitle)
                  : utils.refineText(
                      `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                    )}
              </p>
            </div>
          </div>
          <div className="hiddenScrollbar">
            {lyrics.current.data.map((line, index) => {
              if (line.length == 0) {
                return (
                  <div key={"lyrics-line-" + index} className="mt-4 mb-2"></div>
                );
              }
              return (
                <p
                  key={"lyrics-line-" + index}
                  className="text-white mt-2 mb-2 px-2 ps-3 fs-4 fw-normal"
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
