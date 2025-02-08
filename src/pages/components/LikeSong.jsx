import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";

import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { songContext } from "./Song";
import { HashContext } from "./Hash";
import AddToPlaylist from "./AddToPlaylist";

export default function LikeSong({ isLiked, styleClass, likeData }) {
  const { Queue, setQueue } = useContext(songContext);
  const [likeIt, setLikeIt] = useState(false);
  const { openElements, open, close } = useContext(HashContext);

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
  const makeChanges = useCallback(
    (obj) => {
      const foo = async (obj) => {
        const { savedTo, removedFrom } = obj;
        const original = [
          ...savedTo,
          ...likeData.playlistIds.filter((item) => !removedFrom.includes(item)),
        ];
        setLikeIt(original.length > 0);
        close(`add_${likeData.id[0]}`);

        if (savedTo.length > 0) {
          const dataTosend = { ...likeData, playlistIds: savedTo };
          await utils.BACKEND("/save", "POST", {
            savedData: dataTosend,
          });
        }
        if (removedFrom.length > 0) {
          const dataTosend = { ...likeData, playlistIds: removedFrom };
          await utils.BACKEND("/save", "DELETE", {
            savedData: dataTosend,
          });
        }

        setStatus(original);
      };
      foo(obj);
    },
    [likeData, close]
  );

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

  const eleId = useMemo(() => {
    return `add_${likeData.id[0]}_${Math.random().toString(36).substr(2, 9)}`;
  }, [likeData]);

  return (
    <>
      {likeIt ? (
        <button className={styleClass} onClick={() => open(eleId)}>
          <img src={likeFilled} />
        </button>
      ) : (
        <button className={styleClass} onClick={() => save()}>
          <img src={likeOutlined} />
        </button>
      )}

      {openElements.includes(eleId) && (
        <AddToPlaylist
          playlistIds={likeData.playlistIds}
          makeChanges={(obj) => makeChanges(obj)}
        />
      )}
    </>
  );
}
