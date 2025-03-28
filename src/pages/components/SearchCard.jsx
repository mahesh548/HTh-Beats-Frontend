import { useNavigate } from "react-router";
import utils from "../../../utils";
import { useContext } from "react";
import { songContext } from "./Song";
export default function SearchCard({ data, ac }) {
  const { Queue, setQueue } = useContext(songContext);
  const navigate = useNavigate();
  const showResult = (type, id) => {
    navigate(`/${type}/${id}`);
  };

  //detecting if song is playable or not
  const typeEntity =
    data.type != "song"
      ? "entity"
      : !data?.more_info
      ? "unplayable"
      : "playable";

  //likeData to save
  const likeData =
    typeEntity == "entity"
      ? { id: data.id, type: data.type == "artist" ? "artist" : "entity" }
      : {
          type: "song",
          id: [data.id],
          playlistIds: JSON.parse(localStorage?.preferedPlaylist),
        };

  return (
    <div className="playlistSong mt-4">
      <img
        src={data.image}
        alt={`${data?.title || data?.name}`}
        className={`playlistSongImg rounded ${
          data.type == "artist" ? "rounded-circle" : ""
        }`}
        onClick={() => showResult(data.type, data?.perma_url || data?.url)}
      />
      <div
        className={`${ac ? "extendedGrid" : ""}`}
        onClick={() => showResult(data.type, data?.perma_url || data?.url)}
      >
        <p
          className="thinOneLineText playlistSongTitle"
          style={{ color: data.id == Queue.song ? "wheat" : "#ffffff" }}
        >
          {utils.refineText(data?.title || data?.name)}
        </p>
        <p className="thinOneLineText playlistSongSubTitle">
          {utils.capitalLetter(data.type)}
          {data.subtitle ? ` · ${utils.refineText(data.subtitle)}` : ""}
        </p>
      </div>
      {!ac && <div>{typeEntity == "playable" && <button>=</button>}</div>}
      {!ac && <div>{typeEntity != "unplayable" && <button>+</button>}</div>}
    </div>
  );
}
