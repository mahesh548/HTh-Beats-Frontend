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
import LikeSong from "./LikeSong";
import { HashContext } from "./Hash";
import QueuePage from "./QueuePage";
import SwipeableViews from "react-swipeable-views";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import OptionSong from "./OptionSong";
import OffCanvas from "./BottomSheet";
import BackButton from "./BackButton";

export default function Player() {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close } = useContext(HashContext);
  const [isSliding, setIsSliding] = useState(false);
  const [localLike, setLocalLike] = useState(false);
  const [repeatOne, setRepeatOne] = useState(
    JSON.parse(localStorage.getItem("repeat")) || false
  );
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
  const togglePlay = () => {
    if (Queue.status === "stop") {
      setQueue({ type: "STATUS", value: "play" });
      return;
    }
    if (Queue.status == "play" || Queue.status == "resume") {
      setQueue({ type: "STATUS", value: "pause" });
    } else {
      setQueue({ type: "STATUS", value: "resume" });
    }
  };
  const seek = (event) => {
    document.getElementById("audio").currentTime = event.target.value;
  };

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

    if (lyrics.current?.id == id) {
      open("lyrics");
      return;
    }

    if (snippet == "No Lyrics") return;
    const response = await utils.API(`/lyrics?id=${id}`, "GET");
    if (response.status) {
      const lyricArray = response.lyrics.split("<br>");
      /* .filter((line) => line.length != 0); */
      console.log(lyricArray);
      lyrics.current = { data: lyricArray, id: id, color: color };
      open("lyrics");
    }
  };
  const setRepeat = () => {
    const value = JSON.parse(localStorage.getItem("repeat")) || false;
    localStorage.setItem("repeat", !value);
    setRepeatOne(!value);
  };
  return (
    <div className="playerCont">
      <div className="blurPage">
        <div></div>
        <img src={data.image} alt="" />
      </div>
      <SwipeableViews
        resistance
        disabled={isSliding}
        index={openElements.includes("queue") ? 1 : 0}
        onChangeIndex={(index) => (index == 0 ? close("queue") : open("queue"))}
      >
        <div className="player">
          <div className="playerNav">
            <button onClick={() => closePlayer()}>
              <ChevronLeftRounded />
            </button>
            <div>
              <p>PLAYING FROM {Queue.playlist.type.toUpperCase()}</p>
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
          <div className="playerController">
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

              <button
                className="lyricsLine playerDetailsButton"
                onClick={() =>
                  getLyrics(
                    data.more_info?.lyrics_snippet || "No Lyrics",
                    data.id
                  )
                }
              >
                <FormatQuoteRounded />
                <p>{data.more_info?.lyrics_snippet || "No Lyrics"}</p>
              </button>
            </div>
            <input
              className="sliderRange RANGE"
              type="range"
              onInput={(e) => seek(e)}
              id="timeLine"
              width="100%"
              max={data.more_info.duration}
              onMouseDown={() => setIsSliding(true)}
              onMouseUp={() => setIsSliding(false)}
              onTouchStart={() => setIsSliding(true)}
              onTouchEnd={() => setIsSliding(false)}
            />
            <div id="cd" className="cd CD">
              00:00
            </div>
            <div id="fd" className="fd">
              {utils.formatDuration(data.more_info.duration) || "00:00"}
            </div>
            <div className="playerButtons">
              <button style={{ justifyContent: "start" }}>
                <img src={downloadOutlined} width={"30px"} />
              </button>
              <button onClick={() => setQueue({ type: "PREV" })}>
                <SkipPreviousRounded style={{ fontSize: "60px" }} />
              </button>
              <button onClick={() => togglePlay()}>
                {Queue.status === "pause" || Queue.status === "stop" ? (
                  <PlayCircleFilled style={{ fontSize: "70px" }} />
                ) : (
                  <PauseCircleFilled style={{ fontSize: "70px" }} />
                )}
              </button>
              <button onClick={() => setQueue({ type: "NEXT" })}>
                <SkipNextRounded style={{ fontSize: "60px" }} />
              </button>
              <button
                style={{ justifyContent: "end" }}
                onClick={() => open("queue")}
              >
                <img src={playlistOutlined} width={"30px"} />
              </button>
            </div>
          </div>
          <div className="playerBottomBar">
            <button onClick={() => setRepeat()}>
              {repeatOne ? <RepeatOneOutlined /> : <RepeatOutlined />}
            </button>

            <button>
              <ShareOutlined />
            </button>
          </div>
        </div>
        <QueuePage />
      </SwipeableViews>

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
    </div>
  );
}
