import { useContext, useState, useCallback } from "react";
import BackButton from "./BackButton";
import { AuthContext } from "./Auth";
import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { Add } from "@mui/icons-material";
import utils from "../../../utils";
import { HashContext } from "./Hash";
import { songContext } from "./Song";
export default function AddToPlaylist({
  likeData,
  playlistIds,
  results,
  eleId,
}) {
  const { user } = useContext(AuthContext);

  //storing the id of the playlist in which the song is saved
  const [addedTo, setAddedTo] = useState(
    playlistIds.map((item) => item.id) || []
  );
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
    const savedTo = addedTo.filter(
      (item) => !playlistIds.map((item) => item.id).includes(item)
    );
    //filtering the playlist from which the song is removed
    const removedFrom = playlistIds
      .map((item) => item.id)
      .filter((item) => !addedTo.includes(item));

    makeChanges({
      savedTo,
      removedFrom,
    });
  };

  const setStatus = (ids) => {
    //updating the Queue with the new playlist
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
        //making new array of object with playlist data
        const original = [
          ...savedTo.map((item) => {
            return playlistIds.find((item2) => item2.id == item);
          }),
          ...playlistIds.filter((item) => !removedFrom.includes(item.id)),
        ];

        results(original);
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

        setStatus(original);
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
