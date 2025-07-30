import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import Video from "./Video";
import PlaylistOwner from "./PlaylistOwner";
import LikeSong from "./LikeSong";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import { MoreVertOutlined } from "@mui/icons-material";
import OptionSong from "./OptionSong";

const GetVideo = ({ has_video, url = "", thumb = "", img = "" }) => {
  if (has_video) {
    return <Video src={url} thumbSrc={thumb} />;
  } else {
    return (
      <div className="imageVid">
        <div className="d-flex">
          <div className="visualizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <img src={img.replace("150x150", "500x500")} className="reelImg" />
          <div className="visualizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
    );
  }
};

export default function ReelVideo({
  song,
  setGlobalLike,
  isLiked,
  index,
  currentIndex,
  muted,
  play,
}) {
  const { openElements, close } = useContext(HashContext);
  const [localLike, setLocalLike] = useState(false);

  useEffect(() => {
    setLocalLike(isLiked);
  }, [isLiked]);

  const addId = useMemo(() => {
    return `add_${song?.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [song?.id]);
  const artId = useMemo(() => {
    return `art_${song?.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [song?.id]);

  const likeData = useMemo(() => {
    const playlistPreference = localStorage?.preferedPlaylist;
    if (playlistPreference) {
      return {
        type: "song",
        id: [song.id],
        playlistIds: JSON.parse(playlistPreference),
      };
    }
    return null;
  }, []);

  const addResult = (obj) => {
    const { savedTo } = obj;
    setLocalLike(savedTo.length > 0);
    setGlobalLike?.(obj, data.id);
  };
  const setColor = async (src) => {
    document.getElementById("reelVid-" + song.id).style.backgroundColor =
      await utils.getAverageColor(src);
  };
  if (index == currentIndex) {
    setTimeout(() => {
      setColor(song.image);
    }, 500);
  }

  const reelTimeUpdate = (index) => {
    const reelAudio = document.getElementById("reelAudio");
    const currentTime = reelAudio.currentTime;
    const timeLine = document.getElementById("reelTimeLine-" + index);

    if (reelAudio.duration > 60) {
      // Play from 30s to 60s
      if (currentTime > 60) {
        reelAudio.currentTime = 30;
      }

      // Duration of this playback slice = 30s, offset = 30
      timeLine.style.background = utils.timeLineStyleReel(reelAudio, 30, 30);
    } else {
      // Play from 0s to 30s
      if (currentTime > 30) {
        reelAudio.currentTime = 0;
      }

      // Duration = 30s, offset = 0
      timeLine.style.background = utils.timeLineStyleReel(reelAudio, 30, 0);
    }
  };
  const songFromReel = (id) => {
    setTimeout(() => {
      play(id);
    }, 500);
    close("reels");
  };

  const data = song?.more_info;
  if (
    index !== currentIndex &&
    index !== currentIndex - 1 &&
    index !== currentIndex + 1
  ) {
    return (
      <div
        className="reelVideoCont position-relative"
        id={"reelVid-" + song.id}
      ></div>
    );
  }
  return (
    <div className="reelVideoCont position-relative" id={"reelVid-" + song.id}>
      {currentIndex == index && (
        <audio
          src={utils.decryptor(data?.encrypted_media_url || "")}
          controls
          autoPlay={true}
          style={{ display: "none" }}
          preload="auto"
          crossOrigin="anonymous"
          id="reelAudio"
          onLoadedMetadata={(e) => {
            if (e.target.duration < 60) return;
            e.target.currentTime = 30;
          }}
          onTimeUpdate={() => reelTimeUpdate(index)}
          muted={muted}
        ></audio>
      )}
      <GetVideo
        has_video={data?.has_video || false}
        url={data?.video_preview_url}
        thumb={data?.video_thumbnail}
        img={song?.image}
      />
      <div className="reelController px-3 py-3">
        <div className="d-flex mb-2 px-1 ps-2 artInfo">
          <PlaylistOwner
            srcArray={data?.artistMap?.artists
              .slice(0, 3)
              .map((item) => item.image)}
            label={""}
            name={data?.artistMap?.artists[0].name}
            totalOwner={data?.artistMap?.artists.length}
            action={() => {}}
          />
          <OptionSong
            styleClass="iconButton"
            data={song}
            likeData={likeData}
            addId={addId}
          >
            <MoreVertOutlined />
          </OptionSong>
        </div>
        <div className="reelInfo px-2 py-2">
          <div className="playlistSong mt-0">
            <img
              src={song.image}
              alt={song.title}
              className="playlistSongImg"
              style={{ borderRadius: "8px", width: "60px", height: "60px" }}
              onClick={() => songFromReel(song?.id)}
            />
            <div onClick={() => songFromReel(song?.id)}>
              <p className="thinOneLineText playlistSongTitle">
                {utils.refineText(song.title)}
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                {song.subtitle?.length != 0
                  ? utils.refineText(song.subtitle)
                  : utils.refineText(
                      `${song.more_info?.music}, ${song.more_info?.album}, ${song.more_info?.label}`
                    )}
              </p>
            </div>
            <LikeSong
              styleClass="playerDetailsButton"
              isLiked={localLike}
              likeData={likeData}
              addId={addId}
              key={`reelLike_${song.id}`}
            />
          </div>
        </div>
        <div className="reelTimeLine" id={"reelTimeLine-" + index}></div>
      </div>
      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={song.savedIn || []}
            results={(obj) => addResult(obj)}
            eleId={addId}
          />,
          document.body
        )}
    </div>
  );
}
