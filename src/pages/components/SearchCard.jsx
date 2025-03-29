import { useNavigate } from "react-router";
import utils from "../../../utils";
import { useContext, useMemo } from "react";
import { songContext } from "./Song";
import LikeEntity from "./LikeEntity";
import LikeSong from "./LikeSong";
import { HashContext } from "./Hash";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";

import addTo from "../../assets/icons/addTo.svg";

export default function SearchCard({ data, ac, setGlobalLike }) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements } = useContext(HashContext);

  const navigate = useNavigate();
  const showResult = (data, typeEntity) => {
    if (typeEntity == "playable") {
      playNow(data);
      return;
    }

    navigate(`/${data.type}/${data?.url || data?.id}`);
  };

  //detecting if song is playable or not
  const typeEntity = data.hasOwnProperty("isLiked")
    ? "entity"
    : data.hasOwnProperty("savedIn")
    ? "playable"
    : "unplayable";

  //likeData to save
  const likeData =
    typeEntity == "entity"
      ? { id: data.id, type: data.type == "artist" ? "artist" : "entity" }
      : {
          type: "song",
          id: [data.id],
          playlistIds: JSON.parse(localStorage?.preferedPlaylist),
        };

  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const isLiked = Queue?.saved && Queue?.saved.includes(data.id);

  const playNow = (songData) => {
    const playlist = {
      title: songData.title,
      type: "search",
      list: [songData],
    };
    setQueue({
      type: "NEW",
      value: {
        playlist: playlist,
        song: songData.id,
        status: "play",
      },
    });
  };

  const toggleQueue = (data) => {
    if (!Queue.song || data.id == Queue.song) return;
    const newList =
      Queue.playlist.list.indexOf(data) != -1
        ? Queue.playlist.list.filter((item) => item.id != data.id)
        : [...Queue.playlist.list, data];
    setQueue({
      type: "PLAYLIST",
      value: { ...Queue.playlist, list: newList },
    });
  };

  return (
    <>
      <div className="playlistSong mt-4">
        <img
          src={data.image}
          alt={`${data?.title || data?.name}`}
          className={`playlistSongImg rounded ${
            data.type == "artist" ? "rounded-circle" : ""
          }`}
          onClick={() => showResult(data, typeEntity)}
        />
        <div
          className={`${ac ? "extendedGrid" : ""}`}
          onClick={() => showResult(data, typeEntity)}
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
        {!ac && typeEntity == "entity" && <div></div>}
        {!ac && typeEntity == "entity" && (
          <div>
            {
              <LikeEntity
                isLiked={data.isLiked}
                likeData={likeData}
                styleClass="playlistSongButton playlistSongLike"
              />
            }
          </div>
        )}

        {!ac && typeEntity == "playable" && (
          <div>
            {Queue?.song && (
              <button
                className="playlistSongButton playlistSongLike"
                onClick={() => toggleQueue(data)}
                style={{ scale: "0.6" }}
              >
                <img src={addTo} />
              </button>
            )}
          </div>
        )}
        {!ac && typeEntity == "playable" && (
          <div>
            {
              <LikeSong
                styleClass="playlistSongButton playlistSongLike"
                isLiked={data.savedIn.length > 0 || isLiked}
                likeData={likeData}
                addId={addId}
                key={data.id}
              />
            }
          </div>
        )}
      </div>
      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={data.savedIn || []}
            results={(obj) => setGlobalLike(obj, data.id)}
            eleId={addId}
          />,
          document.body
        )}
    </>
  );
}
