import { useContext, useState } from "react";
import BackButton from "./BackButton";
import { AuthContext } from "./Auth";
import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
export default function AddToPlaylist({ songdIds, playlistIds }) {
  const { user } = useContext(AuthContext);
  const [addedTo, setAddedTo] = useState(playlistIds);
  const toggleList = (id) => {
    const newList = addedTo.includes(id)
      ? addedTo.filter((item) => item != id)
      : [...addedTo, id];
    setAddedTo(newList);
  };
  return (
    <div className="floatingPage">
      <div className="addToCont">
        <div className="navbarAddTo">
          <BackButton />
          <p>Add to playlists</p>
        </div>
        <div>
          {user.users_playlists.map((item) => {
            return (
              <button className="plCont" onClick={() => toggleList(item.id)}>
                <p>{item.title}</p>
                <img
                  src={addedTo.includes(item.id) ? likeFilled : likeOutlined}
                />
              </button>
            );
          })}
        </div>
        <div>
          <button className="addToBut buttonSecondary">Create playlist</button>
          <button
            className="addToBut buttonPrimary"
            style={{ backgroundColor: "wheat" }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
