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

export default function ReelVideo({ song, setGlobalLike, isLiked }) {
  const { openElements, open, close } = useContext(HashContext);
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

  const data = song?.more_info;
  return (
    <div className="reelVideoCont position-relative" id={"reelVid-" + song.id}>
      <GetVideo
        has_video={data?.has_video || false}
        url={data?.video_preview_url}
        thumb={data?.video_thumbnail}
        img={song?.image}
      />
      <div className="reelController">
        <div className="reelInfo">
          <div className="d-flex">
            <PlaylistOwner
              srcArray={data?.artistMap?.artists
                .slice(0, 3)
                .map((item) => item.image)}
              label={""}
              name={data?.artistMap?.artists[0].name}
              totalOwner={data?.artistMap?.artists.length}
              action={() => open(artId)}
            />
            <OptionSong
              styleClass="playlistSongButton"
              data={song}
              likeData={likeData}
              addId={addId}
            >
              <MoreVertOutlined />
            </OptionSong>
          </div>

          <div className="playlistSong">
            <img
              src={song.image}
              alt={song.title}
              className="playlistSongImg"
            />
            <div>
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
