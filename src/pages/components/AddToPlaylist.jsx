import { useContext, useState } from "react";
import BackButton from "./BackButton";
import { AuthContext } from "./Auth";
import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { Add } from "@mui/icons-material";
export default function AddToPlaylist({ playlistIds, makeChanges }) {
  const { user } = useContext(AuthContext);
  const [addedTo, setAddedTo] = useState(playlistIds);
  const toggleList = (id) => {
    const newList = addedTo.includes(id)
      ? addedTo.filter((item) => item != id)
      : [...addedTo, id];
    setAddedTo(newList);
  };
  const saveChanges = () => {
    const savedTo = addedTo.filter((item) => !playlistIds.includes(item));
    const removedFrom = playlistIds.filter((item) => !addedTo.includes(item));

    makeChanges({
      savedTo,
      removedFrom,
    });
  };
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
