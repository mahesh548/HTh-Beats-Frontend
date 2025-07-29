import SwipeableViews from "react-swipeable-views";
import BackButton from "./BackButton";
import ReelVideo from "./ReelVideo";
import { useContext, useState } from "react";
import { Speaker, VolumeUpOutlined } from "@mui/icons-material";
import { songContext } from "./Song";

export default function Reels({ data, setGlobalLike = () => {} }) {
  const { Queue, setQueue } = useContext(songContext);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <button className="iconButton">
          <VolumeUpOutlined />
        </button>
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
              inView={index == currentIndex}
            />
          );
        })}
      </SwipeableViews>
    </div>
  );
}
