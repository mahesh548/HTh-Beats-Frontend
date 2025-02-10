import utils from "../../../utils";
import LikeSong from "./LikeSong";
import { useMemo } from "react";
import OptionSong from "./OptionSong";
export default function PlaylistSong({
  data,
  play,
  more_opt,
  isPlaying,
  isLiked,
}) {
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
  return (
    <div className="playlistSong">
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
      <div>
        {isLiked ? (
          <LikeSong
            styleClass="playlistSongButton playlistSongLike"
            isLiked={isLiked}
            likeData={likeData}
            savedIn={data.savedIn.map((item) => item.id)}
            key={data.id}
          />
        ) : (
          <></>
        )}
      </div>
      <div>
        <OptionSong styleClass="playlistSongButton" data={data} />
      </div>
    </div>
  );
}
