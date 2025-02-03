import { useCallback, useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import { debounce } from "lodash";

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
    console.log("changing is liked");
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
  const makeChanges = async (obj) => {
    const { savedTo, removedFrom } = obj;
    close("addToPlaylist");

    if (savedTo.length > 0) {
      setLikeIt(true);
    } else {
      setLikeIt(false);
    }
    if (removedFrom.length > 0) {
    }
    const original = likeData.playlistIds.filter(
      (item) => !removedFrom.includes(item)
    );
    setStatus([...savedTo, ...original]);
  };

  const save = async () => {
    setLikeIt(true);
    callApi();
  };

  const callApi = useCallback(
    debounce(() => {
      const req = async () => {
        const response = await utils.BACKEND("/save", "POST", {
          savedData: likeData,
        });
        if (response?.status == true) {
          setStatus(likeData.playlistIds);
        }
      };
      req();
    }, 500),
    [likeData]
  );

  useEffect(() => {
    console.log(likeIt);
  }, [likeIt]);

  return (
    <>
      {likeIt ? (
        <button className={styleClass} onClick={() => open("addToPlaylist")}>
          <img src={likeFilled} />
        </button>
      ) : (
        <button className={styleClass} onClick={() => save()}>
          <img src={likeOutlined} />
        </button>
      )}

      {openElements.includes("addToPlaylist") && (
        <AddToPlaylist
          playlistIds={likeData.playlistIds}
          makeChanges={(obj) => makeChanges(obj)}
        />
      )}
    </>
  );
}
