import { useContext, useMemo } from "react";
import { songContext } from "./Song";
import utils from "../../../utils";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";

import { HashContext } from "./Hash";
import LikeSong from "./LikeSong";

import SwipeableViews from "react-swipeable-views";

export default function MiniPlayer() {
  const { Queue, setQueue } = useContext(songContext);
  const { open } = useContext(HashContext);

  const setColor = async (url) => {
    const color = await utils.getAverageColor(url, 0.5);
    document.getElementById("miniPlayer").style.backgroundColor = color;
  };
  const togglePlay = () => {
    if (Queue.status == "play" || Queue.status == "resume") {
      setQueue({ type: "STATUS", value: "pause" });
    } else {
      setQueue({ type: "STATUS", value: "resume" });
    }
  };

  if (Queue.song == undefined) {
    return <></>;
  }

  const data = utils.getItemFromId(Queue.song, Queue.playlist.list);
  setColor(data.image);

  const likeData = useMemo(() => {
    const playlistPreference = localStorage?.preferedPlaylist;
    if (playlistPreference) {
      return {
        type: "song",
        id: [Queue.song],
        playlistIds: JSON.parse(playlistPreference),
      };
    }
    return null;
  }, [Queue.song]);

  return (
    <div className="playlistSong miniPlayer" id="miniPlayer">
      <div className="miniRange RANGE"></div>
      <img
        src={data.image}
        alt=""
        className="playlistSongImg miniPlayerPoster"
        onClick={() => open("player")}
      />

      <SwipeableViews
        resistance
        index={(() => {
          return Queue.playlist.list.indexOf(
            utils.getItemFromId(Queue.song, Queue.playlist.list)
          );
        })()}
        onChangeIndex={(index) => {
          const currentIndex = Queue.playlist.list.indexOf(
            utils.getItemFromId(Queue.song, Queue.playlist.list)
          );
          if (index > currentIndex) {
            setQueue({ type: "NEXT" });
          }
          if (index < currentIndex) {
            setQueue({ type: "PREV" });
          }
        }}
      >
        {Queue.playlist.list.map((item) => {
          return (
            <div onClick={() => open("player")}>
              <p className="thinOneLineText playlistSongTitle">
                {utils.refineText(item.title)}
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                {data.subtitle?.length != 0
                  ? utils.refineText(item.subtitle)
                  : utils.refineText(
                      `${item.more_info?.music}, ${item.more_info?.album}, ${item.more_info?.label}`
                    )}
              </p>
            </div>
          );
        })}
      </SwipeableViews>
      <div>
        <LikeSong
          styleClass="miniPlayerButton"
          isLiked={data.savedIn.length > 0}
          likeData={likeData}
        />
      </div>
      <div>
        <button className="miniPlayerButton" onClick={() => togglePlay()}>
          {Queue.status == "pause" ? <PlayArrowRounded /> : <PauseRounded />}
        </button>
      </div>
    </div>
  );
}
