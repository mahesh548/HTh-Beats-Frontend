import { useCallback, useContext, useEffect, useRef, useState } from "react";
import utils from "../../../utils";

import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { songContext } from "./Song";
import { HashContext } from "./Hash";
import { showToast } from "./showToast";

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

  const queueRef = useRef(Queue);

  useEffect(() => {
    setLikeIt(isLiked);
  }, [isLiked]);
  useEffect(() => {
    queueRef.current = Queue;
  }, [Queue]);

  const setStatus = (ids) => {
    if (!queueRef.current.playlist) return;
    const newList = queueRef.current.playlist.list.map((item) => {
      if (likeData.id.includes(item.id)) {
        item.savedIn = [...new Set([...item.savedIn, ...ids])];
      }
      return item;
    });

    setQueue({
      type: "PLAYLIST",
      value: { ...queueRef.current.playlist, list: newList },
    });
  };

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
        showToast({
          text: "Added to Liked songs",
          image:
            "https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/Like_pimjzb.png",
          actionText: "Change",
          onAction: () => open(addId),
          type: "imgBtn",
        });
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
