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
  const { openElements, open, close } = useContext(HashContext);
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
    const color = document.getElementById("miniPlayer").style.backgroundColor;

    if (snippet == "No Lyrics") {
      showToast({ text: "Lyrics not available" });
      return;
    }

    if (lyrics.current?.id == id && lyrics.current.data.length > 2) {
      open("lyrics");
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
      lyrics.current = { data: lyricArray, id: id, color: color };
      open("lyrics");
    }
  };

  return (
    <>
      <div className="desk-player">
        <div className="desk-playerNav">
          <button onClick={() => closePlayer()}>
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
            <p className="thinOneLineText playerTitle">
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
            styleClass="playerDetailsButton"
            isLiked={localLike}
            likeData={likeData}
            addId={addId}
            key={`playerLike_${data.id}`}
          />
        </div>
      </div>
      {/*  <QueuePage /> */}

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
          className="floatingPage overflow-scroll hiddenScrollbar"
          style={{ backgroundColor: lyrics.current.color }}
        >
          <div
            className="libraryNavCont px-2"
            style={{
              zIndex: "11",
              backgroundColor: lyrics.current.color,
              boxShadow: "0px 5px 5px " + lyrics.current.color,
            }}
          >
            <div
              className="libraryNav mt-3 mb-1"
              style={{ gridTemplateColumns: "40px auto 40px" }}
            >
              <BackButton styleClass="m-0 p-0" />
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
          </div>
          <div style={{ marginTop: "80px" }}>
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
