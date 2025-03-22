import { useReducer } from "react";
import BackButton from "./BackButton";

const editReducer = (state, action) => {
  switch (action.type) {
    case value:
      break;

    default:
      return { ...state };
  }
};

export default function EditPlaylist({ title, img, list, members }) {
  const [editData, setEditData] = useReducer(editReducer, {
    title,
    img,
    list,
    members,
  });

  return (
    <div className="floatingPage">
      <div className="editCont">
        <div className="navbarAddTo">
          <BackButton />
          <p>Edit playlist</p>
          <button className="iconButton text-wheat">Save</button>
        </div>
        <div>
          <img
            src={editData.img}
            style={{ height: "235px", width: "235px" }}
            className="d-block"
          />
          <button>Change cover</button>
        </div>
        <input
          type="text"
          value={editData.title}
          className="iconButton mpInput"
          onInput={(e) => {}}
          id="playlistEditName"
        />
        <div>
          <p className="labelText">Members</p>
        </div>
        <div>
          <p className="labelText">Songs</p>
        </div>
      </div>
    </div>
  );
}
