import SwipeableViews from "react-swipeable-views";
import BackButton from "./BackButton";
import ReelVideo from "./ReelVideo";
import { useContext, useState, useEffect } from "react";
import {
  CloseOutlined,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import { songContext } from "./Song";
import { useNavigate } from "react-router";

export default function Reels({ data, setGlobalLike = () => {}, play }) {
  const { Queue, setQueue } = useContext(songContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => Math.min(prev + 1, data.list.length - 1));
      } else if (e.key === "ArrowUp") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data.list.length]);

  const isDesktop = window.innerWidth >= 1000;

  if (isDesktop) {
    return (
      <div className="deskBack contextMenuPart" onClick={() => goBack()}>
        <div
          className="deskEditCont position-absolute p-0"
          onClick={(e) => e.stopPropagation()}
          style={{ borderRadius: "12px" }}
        >
          <div className="navbarAddTo editNav position-absolute reelNav p-3">
            <p className="thinOneLineText fw-bold">
              {data?.title || "HTh Videos"}
            </p>
            {muted ? (
              <button className="iconButton" onClick={() => setMuted(false)}>
                <VolumeOffOutlined />
              </button>
            ) : (
              <button className="iconButton" onClick={() => setMuted(true)}>
                <VolumeUpOutlined />
              </button>
            )}
            <button className="iconButton" onClick={() => goBack()}>
              <CloseOutlined />
            </button>
          </div>
          <div className="overflow-hidden" style={{ borderRadius: "12px" }}>
            <SwipeableViews
              resistance
              axis="y"
              containerStyle={{ height: "88vh" }}
              index={currentIndex}
            >
              {data.list.map((song, index) => {
                const isLiked = Queue?.saved && Queue?.saved.includes(song.id);
                return (
                  <ReelVideo
                    song={song}
                    key={`reels-${song?.id}-${index}`}
                    setGlobalLike={setGlobalLike}
                    isLiked={isLiked}
                    index={index}
                    currentIndex={currentIndex}
                    muted={muted}
                    play={play}
                  />
                );
              })}
            </SwipeableViews>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="floatingPage"
      style={{ backgroundColor: "var(--desktop-dark-grey)", zIndex: "30" }}
    >
      <div
        className="navbarAddTo editNav"
        style={{ backgroundColor: "transparent", zIndex: "1" }}
      >
        <BackButton />
        <p className="thinOneLineText fw-bold">{data?.title || "HTh Videos"}</p>
        {muted ? (
          <button className="iconButton" onClick={() => setMuted(false)}>
            <VolumeOffOutlined />
          </button>
        ) : (
          <button className="iconButton" onClick={() => setMuted(true)}>
            <VolumeUpOutlined />
          </button>
        )}
      </div>
      <SwipeableViews
        resistance
        axis="y"
        containerStyle={{ height: "100dvh" }}
        index={0}
        onChangeIndex={(index) => setCurrentIndex(index)}
      >
        {data.list.map((song, index) => {
          const isLiked = Queue?.saved && Queue?.saved.includes(song.id);
          return (
            <ReelVideo
              song={song}
              key={`reels-${song?.id}-${index}`}
              setGlobalLike={setGlobalLike}
              isLiked={isLiked}
              index={index}
              currentIndex={currentIndex}
              muted={muted}
              play={play}
            />
          );
        })}
      </SwipeableViews>
    </div>
  );
}
