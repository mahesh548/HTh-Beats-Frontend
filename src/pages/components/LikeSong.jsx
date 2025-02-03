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
  const { openElements, open } = useContext(HashContext);
  useEffect(() => {
    setLikeIt(isLiked);
  }, [isLiked]);
  const setStatus = (status) => {
    if (status) {
      const newList = Queue.playlist.list.map((item) => {
        if (likeData.id.includes(item.id)) {
          item.savedIn = likeData.playlistIds;
        }
        return item;
      });

      setQueue({
        type: "PLAYLIST",
        value: { ...Queue.playlist, list: newList },
      });
    } else {
      console.log("initalize dislike");
    }
  };

  const save = async () => {
    setLikeIt(true);
    callApi("like");
  };
  const unSave = async () => {
    setLikeIt(false);

    /* callApi("dislike"); */
    open("addToPlaylist");
  };

  const callApi = useCallback(
    debounce((action) => {
      const req = async () => {
        if (action == "like") {
          const response = await utils.BACKEND("/save", "POST", {
            savedData: likeData,
          });
          if (response?.status == true) {
            setStatus(true);
          }
        } else {
          const response = await utils.BACKEND("/save", "DELETE", {
            savedData: likeData,
          });
          if (response?.status == true) {
            setStatus(false);
          }
        }
      };
      req();
    }, 500),
    [likeData]
  );

  return (
    <>
      {likeIt ? (
        <button className={styleClass} onClick={() => unSave()}>
          <img src={likeFilled} />
        </button>
      ) : (
        <button className={styleClass} onClick={() => save()}>
          <img src={likeOutlined} />
        </button>
      )}
      {openElements.includes("addToPlaylist") && (
        <AddToPlaylist playlistIds={likeData.playlistIds} />
      )}
    </>
  );
}
