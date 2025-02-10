import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";

import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { songContext } from "./Song";
import { HashContext } from "./Hash";
import AddToPlaylist from "./AddToPlaylist";
import { createPortal } from "react-dom";

export default function LikeSong({ isLiked, styleClass, likeData, savedIn }) {
  const { Queue, setQueue } = useContext(songContext);
  const [likeIt, setLikeIt] = useState(false);
  const { openElements, open } = useContext(HashContext);

  const eleId = useMemo(() => {
    return `add_${likeData.id[0]}_${Math.random().toString(36).substr(2, 9)}`;
  }, [likeData]);
  useEffect(() => {
    setLikeIt(isLiked);
  }, [isLiked]);

  const setStatus = (ids) => {
    if (!Queue.playlist) return;
    const newList = Queue.playlist.list.map((item) => {
      if (likeData.id.includes(item.id)) {
        item.savedIn = ids;
      }
      return item;
    });

    setQueue({
      type: "PLAYLIST",
      value: { ...Queue.playlist, list: newList },
    });
  };
  const results = (original) => {
    setLikeIt(original.length > 0);
  };

  const save = useCallback(() => {
    const req = async () => {
      setLikeIt(true);
      const response = await utils.BACKEND("/save", "POST", {
        savedData: likeData,
      });
      if (response?.status == true) {
        setStatus(likeData.playlistIds);
      }
    };
    req();
  }, [likeData.id]);

  return (
    <>
      {likeIt ? (
        <button
          className={styleClass}
          onClick={() => {
            console.log(eleId);
            open(eleId);
          }}
        >
          <img src={likeFilled} />
        </button>
      ) : (
        <button className={styleClass} onClick={() => save()}>
          <img src={likeOutlined} />
        </button>
      )}

      {openElements.includes(eleId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={savedIn}
            results={(obj) => results(obj)}
            eleId={eleId}
          />,
          document.body
        )}
    </>
  );
}
