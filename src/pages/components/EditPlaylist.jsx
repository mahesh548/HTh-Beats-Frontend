import { useContext, useReducer } from "react";
import BackButton from "./BackButton";

import utils from "../../../utils";
import { DoNotDisturbOnOutlined } from "@mui/icons-material";
import { AuthContext } from "./Auth";

const editReducer = (state, action) => {
  switch (action.type) {
    case "song":
      return {
        ...state,
        list: state.list.filter((item) => item.id != action.id),
      };

    case "title":
      return { ...state, title: action.value };

    default:
      return { ...state };
  }
};

export default function EditPlaylist({ title, img, list }) {
  const [editData, setEditData] = useReducer(editReducer, {
    title,
    img,
    list,
  });
  const auth = useContext(AuthContext);

  return (
    <div className="floatingPage">
      <div className="editCont hiddenScrollbar">
        <div className="navbarAddTo editNav">
          <BackButton />
          <p>Edit playlist</p>
          <button className="iconButton text-wheat">Save</button>
        </div>
        <div className="text-center" style={{ marginTop: "100px" }}>
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
          onInput={(e) => {
            setEditData({ type: "title", value: e.target.value });
          }}
          id="playlistEditName"
        />

        <div>
          {editData.list.map((item) => {
            return (
              <div
                className="playlistSong"
                style={{
                  width: "98%",
                  margin: "auto",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
                key={`${item.id}_editList`}
              >
                <button
                  className="iconButton"
                  style={{ color: "gray", height: "100%", width: "100%" }}
                  onClick={() => setEditData({ type: "song", id: item.id })}
                >
                  <DoNotDisturbOnOutlined className="m-auto" />
                </button>
                <div className="extendedGrid">
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.title)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {utils.refineText(item.subtitle)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
