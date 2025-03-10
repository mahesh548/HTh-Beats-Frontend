import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";

import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { songContext } from "./Song";
import { HashContext } from "./Hash";

export default function LikeSong({
  isLiked,
  styleClass,
  likeData,
  addId,
  likeClicked,
}) {
  const { Queue, setQueue } = useContext(songContext);
  const [likeIt, setLikeIt] = useState(false);
  const { open } = useContext(HashContext);

  useEffect(() => {
    setLikeIt(isLiked);
  }, [isLiked]);
  useEffect(() => {
    console.log("queue is updated", Queue);
  }, [Queue]);

  const setStatus = useCallback(
    (ids) => {
      console.log("queue", Queue);
      if (!Queue.playlist) return;
      const newList = Queue.playlist.list.map((item) => {
        if (likeData.id.includes(item.id)) {
          item.savedIn = [...new Set([...item.savedIn, ...ids])];
        }
        return item;
      });

      setQueue({
        type: "PLAYLIST",
        value: { ...Queue.playlist, list: newList },
      });
    },
    [Queue, likeData.id, setQueue]
  );

  const save = useCallback(() => {
    const req = async () => {
      setLikeIt(true);
      const response = await utils.BACKEND("/save", "POST", {
        savedData: {
          ...likeData,
          playlistIds: likeData.playlistIds,
        },
      });
      if (response?.status == true) {
        setStatus(likeData.playlistIds);
        const obj = { savedTo: likeData.playlistIds, removedFrom: [] };
        likeClicked?.(obj);
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
            open(addId);
          }}
        >
          <img src={likeFilled} />
        </button>
      ) : (
        <button className={styleClass} onClick={() => save()}>
          <img src={likeOutlined} />
        </button>
      )}
    </>
  );
}
