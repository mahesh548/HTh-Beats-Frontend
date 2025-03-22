import { useReducer } from "react";
import BackButton from "./BackButton";
import utils from "../../../utils";

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
        <div className="text-center">
          <img
            src={editData.img}
            style={{ height: "150px", width: "150px" }}
            className="d-block m-auto"
          />
          <button className="iconButton mt-2">Change cover</button>
        </div>
        <input
          type="text"
          value={editData.title}
          className="iconButton mpInput m-auto"
          onInput={(e) => {}}
          id="playlistEditName"
        />
        <div>
          {editData.members.map((member) => {
            return (
              <div
                className="playlistSong"
                style={{
                  width: "98%",
                  margin: "auto",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
                key={`${member.username}_editOwner`}
              >
                <img src={member.pic} className="playlistSongImg rounded" />
                <div>
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(member.username)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {`Playlist ${member.role}`}
                  </p>
                </div>
                <div></div>
                <div></div>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
}
