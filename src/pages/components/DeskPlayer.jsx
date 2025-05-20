import { useContext, useMemo, useState, useEffect } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import {
  FormatQuoteRounded,
  Fullscreen,
  FullscreenExitOutlined,
  IosShareOutlined,
  PauseCircleFilled,
  PauseRounded,
  PlayArrowRounded,
  PlayCircleFilled,
  RepeatOneOutlined,
  RepeatOutlined,
  ShareOutlined,
  SkipNextRounded,
  SkipPreviousRounded,
  SlideshowOutlined,
  SpeakerNotesOutlined,
  VolumeMuteOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";

import { HashContext } from "./Hash";
import LikeSong from "./LikeSong";
import downloadOutlined from "../../assets/icons/downloadOutlinedPlayer.svg";
import playlistOutlined from "../../assets/icons/playlistOutlined.svg";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { channelContext } from "./Channel";

export default function DeskPlayer({ setFullscreen }) {
  const { Queue, setQueue } = useContext(songContext);
  const { currentSong, sendReaction } = useContext(channelContext);

  const { open, openElements, close, closeOpen, closeAll } =
    useContext(HashContext);
  const [volume, setVolume] = useState(
    (document.getElementById("audio")?.volume || 1) * 100
  );

  const [isFull, setIsFull] = useState(false);

  const [repeatOne, setRepeatOne] = useState(
    JSON.parse(localStorage.getItem("repeat")) || false
  );

  const [localLike, setLocalLike] = useState(false);

  const data = useMemo(() => {
    if (!Queue.song) return null;
    return utils.getItemFromId(Queue.song, Queue.playlist.list);
  }, [Queue?.song, Queue?.playlist?.list, currentSong?.songId]);

  const likeData = useMemo(() => {
    if (!Queue.song) return null;
    const playlistPreference = localStorage?.preferedPlaylist;
    return playlistPreference
      ? {
          type: "song",
          id: [Queue.song],
          playlistIds: JSON.parse(playlistPreference),
        }
      : null;
  }, [Queue?.song]);

  const addId = useMemo(() => {
    return Queue.song
      ? `add_${Queue.song}_${Math.random().toString(36).substr(2, 9)}`
      : "";
  }, [Queue?.song]);

  useEffect(() => {
    if (!data?.savedIn) return;
    setLocalLike(data.savedIn.length > 0);
  }, [data?.savedIn]);

  const togglePlay = () => {
    if (Queue.status === "stop") {
      setQueue({ type: "STATUS", value: "play" });
      return;
    }
    if (Queue.status === "play" || Queue.status === "resume") {
      setQueue({ type: "STATUS", value: "pause" });
    } else {
      setQueue({ type: "STATUS", value: "resume" });
    }
  };

  const seek = (event) => {
    document.getElementById("audio").currentTime = event.target.value;
  };
  const setRepeat = () => {
    const value = JSON.parse(localStorage.getItem("repeat")) || false;
    localStorage.setItem("repeat", !value);
    setRepeatOne(!value);
  };
  const startDownload = async (URL, title) => {
    await utils.downloadThis(URL, title);
  };

  useEffect(() => {
    const audio = document.getElementById("audio");
    const volumeRange = document.getElementById("volumeRange");

    if (volumeRange) volumeRange.style.setProperty("--progress", `${volume}%`);
    if (audio) audio.volume = volume / 100;
  }, [volume]);

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
      console.log("using open");
      open(type);
    }
  };

  const goFullscreen = () => {
    const screen = document.body;
    if (screen?.requestFullscreen) {
      if (!openElements.includes("player")) {
        toggleRightPanel("player");
        setFullscreen("player");
      }
      screen.requestFullscreen();
    }
  };
  const exitFullscreen = () => {
    document.exitFullscreen();
  };

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFull(!isFull);
    };
    const screen = document.body;
    screen.addEventListener("fullscreenchange", handleFullscreen);
    screen.addEventListener("mozfullscreenchange", handleFullscreen);
    screen.addEventListener("webkitfullscreenchange", handleFullscreen);
    screen.addEventListener("msfullscreenchange", handleFullscreen);
    return () => {
      screen.removeEventListener("fullscreenchange", handleFullscreen);
      screen.removeEventListener("mozfullscreenchange", handleFullscreen);
      screen.removeEventListener("webkitfullscreenchange", handleFullscreen);
      screen.removeEventListener("msfullscreenchange", handleFullscreen);
    };
  }, [isFull]);

  if (!Queue.song) return <></>;

  return (
    <div className="deskPlayer">
      <div>
        <div
          className="playlistSong mt-0"
          style={{
            gridTemplateColumns: "80px auto 40px 30px",
            cursor: "pointer",
          }}
        >
          <img
            src={data.image}
            alt={data.title}
            className="playlistSongImg miniPlayerPoster"
            onClick={() => toggleRightPanel("player")}
          />

          <div onClick={() => toggleRightPanel("player")}>
            <p className="thinOneLineText playlistSongTitle">
              {utils.refineText(data.title)}
            </p>
            <p className="thinOneLineText playlistSongSubTitle">
              {data.subtitle?.length !== 0
                ? utils.refineText(data.subtitle)
                : utils.refineText(
                    `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                  )}
            </p>
          </div>
          <div>
            <LikeSong
              styleClass="miniPlayerButton"
              isLiked={localLike}
              likeData={likeData}
              addId={addId}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="playerController">
          <div className="playerButtons">
            <button
              onClick={() =>
                startDownload(data.more_info.encrypted_media_url, data.title)
              }
              className="opacity-50"
            >
              <img src={downloadOutlined} width={"25px"} />
            </button>
            <button
              onClick={() => setQueue({ type: "PREV" })}
              className="opacity-50"
            >
              <SkipPreviousRounded style={{ fontSize: "35px" }} />
            </button>
            <button onClick={() => togglePlay()}>
              {Queue.status === "pause" || Queue.status === "stop" ? (
                <PlayCircleFilled style={{ fontSize: "40px" }} />
              ) : (
                <PauseCircleFilled style={{ fontSize: "40px" }} />
              )}
            </button>
            <button
              onClick={() => setQueue({ type: "NEXT" })}
              className="opacity-50"
            >
              <SkipNextRounded style={{ fontSize: "35px" }} />
            </button>
            <button onClick={() => setRepeat()} className="opacity-50">
              {repeatOne ? <RepeatOneOutlined /> : <RepeatOutlined />}
            </button>
          </div>

          <div className="d-flex mt-1" style={{ gap: "5px" }}>
            <div id="cd" className="cd CD mt-0">
              00:00
            </div>
            <input
              className="sliderRange RANGE"
              type="range"
              onInput={(e) => seek(e)}
              id="timeLine"
              width="100%"
              max={data.more_info.duration}
            />
            <div id="fd" className="fd mt-0">
              {utils.formatDuration(data.more_info.duration) || "00:00"}
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-end"
        style={{ gap: "5px" }}
      >
        <button
          className={`iconButton opacity-50 ${
            openElements.includes("player") && "desk-active"
          }`}
          onClick={() => toggleRightPanel("player")}
        >
          <SlideshowOutlined />
        </button>
        <button
          className={`iconButton opacity-50 ${
            openElements.includes("lyrics") && "desk-active"
          }`}
          id="lyricsBtn"
        >
          <FormatQuoteRounded />
        </button>

        <button
          className={`iconButton opacity-50 ${
            openElements.includes("queue") && "desk-active"
          }`}
          onClick={() => toggleRightPanel("queue")}
        >
          <img src={playlistOutlined} width={"25px"} />
        </button>
        <button className="iconButton opacity-50">
          <ShareOutlined />
        </button>
        <div className="volumneCont">
          {volume > 0 ? (
            <button
              className="iconButton opacity-50"
              onClick={() => setVolume(0)}
            >
              <VolumeUpOutlined />
            </button>
          ) : (
            <button
              className="iconButton opacity-50"
              onClick={() => setVolume(50)}
            >
              <VolumeMuteOutlined />
            </button>
          )}
          <input
            type="range"
            className="volumneRange"
            min={0}
            value={volume}
            max={100}
            onChange={(e) => setVolume(e.target.value)}
            id="volumeRange"
          />
        </div>
        {!isFull ? (
          <button
            className="iconButton opacity-50"
            onClick={() => goFullscreen()}
          >
            <Fullscreen />
          </button>
        ) : (
          <button
            className="iconButton opacity-50"
            onClick={() => exitFullscreen()}
          >
            <FullscreenExitOutlined />
          </button>
        )}
      </div>
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
    </div>
  );
}
