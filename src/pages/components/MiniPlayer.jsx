import { useContext, useMemo, useState, useEffect } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import {
  Add,
  AddReaction,
  ExpandCircleDown,
  ExpandCircleDownOutlined,
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";

import { HashContext } from "./Hash";
import LikeSong from "./LikeSong";

import SwipeableViews from "react-swipeable-views";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { channelContext } from "./Channel";
import { useLocation } from "react-router";
import Emoji from "./Emoji";

export default function MiniPlayer() {
  const { Queue, setQueue } = useContext(songContext);
  const { currentSong } = useContext(channelContext);

  const { open, openElements } = useContext(HashContext);
  const location = useLocation();

  const [localLike, setLocalLike] = useState(false);

  const data = useMemo(() => {
    if (!Queue.song) return null;
    return utils.getItemFromId(Queue.song, Queue.playlist.list);
  }, [Queue?.song, Queue?.playlist?.list, currentSong?.songId]);

  useEffect(() => {
    if (data && data.image) {
      setColor(data.image);
    }
  }, [data?.image]);

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

  const setColor = async (url) => {
    const color = await utils.getAverageColor(url, 0.5);
    document.getElementById("miniPlayer").style.backgroundColor = color;
  };

  const togglePlay = () => {
    if (Queue.status === "play" || Queue.status === "resume") {
      setQueue({ type: "STATUS", value: "pause" });
    } else {
      setQueue({ type: "STATUS", value: "resume" });
    }
  };
  if (!Queue.song) return <></>;

  const isRoom = location.pathname === "/room";
  return (
    <div
      className="playlistSong miniPlayer"
      id="miniPlayer"
      style={{ height: isRoom ? "110px" : "60px" }}
    >
      {isRoom && (
        <div className="instantReact">
          <button className="iconButton">
            <Emoji src={utils.stickerUrl("emoji", "39")} />
          </button>
          <button className="iconButton">
            <Emoji src={utils.stickerUrl("emoji", "4")} />
          </button>
          <button className="iconButton">
            <Emoji src={utils.stickerUrl("emoji", "1")} />
          </button>
          <button className="iconButton">
            <Emoji src={utils.stickerUrl("emoji", "17")} />
          </button>
          <button className="iconButton" onClick={() => open("stickers")}>
            <ExpandCircleDownOutlined
              style={{ rotate: "180deg" }}
              className="text-white-50"
            />
          </button>
        </div>
      )}
      <div className="miniRange RANGE"></div>
      <img
        src={data.image}
        alt={data.title}
        className="playlistSongImg miniPlayerPoster"
        onClick={() => open("player")}
      />

      <SwipeableViews
        resistance
        index={Queue.playlist.list.findIndex((item) => item.id === data.id)}
        onChangeIndex={(index) => {
          const currentIndex = Queue.playlist.list.findIndex(
            (item) => item.id === data.id
          );
          if (index > currentIndex) {
            setQueue({ type: "NEXT" });
          }
          if (index < currentIndex) {
            setQueue({ type: "PREV" });
          }
        }}
      >
        {Queue.playlist.list.map((item) => (
          <div onClick={() => open("player")} key={`miniPlayer_${item.id}`}>
            <p className="thinOneLineText playlistSongTitle">
              {utils.refineText(item.title)}
            </p>
            <p className="thinOneLineText playlistSongSubTitle">
              {data.subtitle?.length !== 0
                ? utils.refineText(item.subtitle)
                : utils.refineText(
                    `${item.more_info?.music}, ${item.more_info?.album}, ${item.more_info?.label}`
                  )}
            </p>
          </div>
        ))}
      </SwipeableViews>
      <div>
        <LikeSong
          styleClass="miniPlayerButton"
          isLiked={localLike}
          likeData={likeData}
          addId={addId}
        />
      </div>
      <div>
        <button className="miniPlayerButton" onClick={togglePlay}>
          {Queue.status === "pause" ? <PlayArrowRounded /> : <PauseRounded />}
        </button>
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
