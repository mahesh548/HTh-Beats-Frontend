import { useContext, useState, useCallback } from "react";
import BackButton from "./BackButton";
import { AuthContext } from "./Auth";
import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { Add } from "@mui/icons-material";
import utils from "../../../utils";
import { HashContext } from "./Hash";
import { songContext } from "./Song";
import { showToast } from "./showToast";
export default function AddToPlaylist({
  likeData,
  playlistIds,
  results,
  eleId,
}) {
  const { user } = useContext(AuthContext);

  //storing the id of the playlist in which the song is saved
  const [addedTo, setAddedTo] = useState(playlistIds || []);
  const { close } = useContext(HashContext);
  const { Queue, setQueue } = useContext(songContext);
  const toggleList = (id) => {
    //toggling the id of the playlist
    const newList = addedTo.includes(id)
      ? addedTo.filter((item) => item != id)
      : [...addedTo, id];
    setAddedTo(newList);
  };
  const saveChanges = () => {
    //filtering the playlist in which the song is saved
    const savedTo = addedTo.filter((item) => !playlistIds.includes(item));
    //filtering the playlist from which the song is removed
    const removedFrom = playlistIds.filter((item) => !addedTo.includes(item));

    makeChanges({
      savedTo,
      removedFrom,
    });
  };

  const notifyText = (savedTo, removedFrom) => {
    if (savedTo.length == 1 && removedFrom.length == 0) {
      const { title } = user.users_playlists.find(
        (item) => item.id == savedTo[0]
      );
      return `Added to ${title}`;
    }
    if (removedFrom.length == 1 && savedTo.length == 0) {
      const { title } = user.users_playlists.find(
        (item) => item.id == removedFrom[0]
      );
      return `Removed from ${title}`;
    }
    return "Changes saved";
  };

  const setStatus = (obj) => {
    //updating the Queue with the new playlist
    if (!Queue.playlist) return;
    const { savedTo, removedFrom } = obj;
    const newList = Queue.playlist.list.map((item) => {
      if (likeData.id.includes(item.id)) {
        item.savedIn = [...new Set([...item.savedIn, ...savedTo])].filter(
          (item) => !removedFrom.includes(item)
        );
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

        if (savedTo.length > 0 || removedFrom.length > 0) {
          results(obj);
        }
        close(eleId);

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
        if (savedTo.length > 0 || removedFrom.length > 0) {
          showToast({
            text: notifyText(savedTo, removedFrom),
          });
          setStatus(obj);
        }
      };
      foo(obj);
    },
    [likeData, eleId]
  );
  return (
    <div className="floatingPage">
      <div className="addToCont">
        <div className="navbarAddTo">
          <BackButton />
          <p>Add to playlists</p>
          <button className="iconButton">
            <Add />
          </button>
        </div>
        <div style={{ overflow: "scroll" }} className="hiddenScrollbar">
          {user.users_playlists.map((item) => {
            return (
              <button
                className="plCont"
                onClick={() => toggleList(item.id)}
                key={item.id}
              >
                <p>{item.title}</p>
                <img
                  src={addedTo.includes(item.id) ? likeFilled : likeOutlined}
                />
              </button>
            );
          })}
        </div>
        <div>
          <button className="addToBut" onClick={() => saveChanges()}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
