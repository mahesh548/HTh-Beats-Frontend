import utils from "../../../utils";
import LikeSong from "./LikeSong";
import { useContext, useEffect, useMemo, useState } from "react";
import OptionSong from "./OptionSong";
import AddToPlaylist from "./AddToPlaylist";
import { createPortal } from "react-dom";
import { HashContext } from "./Hash";
import { MoreVertOutlined } from "@mui/icons-material";

export default function PlaylistSong({
  data,
  play,
  isPlaying,
  isLiked,
  setGlobalLike,
}) {
  const { openElements } = useContext(HashContext);
  const [localLike, setLocalLike] = useState();

  //memoizing the like data
  const likeData = useMemo(() => {
    const playlistPreference = localStorage?.preferedPlaylist;
    if (playlistPreference) {
      return {
        type: "song",
        id: [data.id],
        playlistIds: JSON.parse(playlistPreference),
      };
    }
    return null;
  }, []);

  //setting local like to the value of isLiked
  useEffect(() => {
    setLocalLike(isLiked);
  }, [isLiked]);

  //unique id for the add to playlist element
  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  //setting the local like value base on result of the add to playlist
  const addResult = (obj) => {
    const { savedTo } = obj;
    setLocalLike(savedTo.length > 0);
    setGlobalLike?.(obj, data.id);
  };
  return (
    <div className="playlistSong deskPlaylistSong">
      <img
        src={data.image}
        alt={data.title}
        className="playlistSongImg"
        onClick={() => play(data.id)}
      />
      <div>
        <p
          className="thinOneLineText playlistSongTitle"
          onClick={() => play(data.id)}
          style={{ color: isPlaying ? "wheat" : "#ffffff" }}
        >
          {utils.refineText(data.title)}
        </p>
        <p
          className="thinOneLineText playlistSongSubTitle"
          onClick={() => play(data.id)}
        >
          {data.subtitle?.length != 0
            ? utils.refineText(data.subtitle)
            : utils.refineText(
                `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
              )}
        </p>
      </div>
      <div className="desk">
        <p
          className="thinOneLineText playlistSongSubTitle"
          onClick={() => play(data.id)}
        >
          {utils.refineText(data.more_info?.album || "No album")}
        </p>
      </div>
      <div className="desk">
        <p
          className="thinOneLineText playlistSongSubTitle text-center"
          onClick={() => play(data.id)}
        >
          {utils.formatDuration(data.more_info?.duration) || "00:00"}
        </p>
      </div>
      <div className="desk-likeBut">
        {localLike ? (
          <LikeSong
            styleClass="playlistSongButton playlistSongLike"
            isLiked={localLike}
            likeData={likeData}
            addId={addId}
            key={data.id}
          />
        ) : (
          <></>
        )}
      </div>
      <div>
        <OptionSong
          styleClass="playlistSongButton"
          data={data}
          likeData={likeData}
          addId={addId}
        >
          <MoreVertOutlined />
        </OptionSong>
      </div>
      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={data.savedIn || []}
            results={(obj) => addResult(obj)}
            eleId={addId}
          />,
          document.body
        )}
    </div>
  );
}
