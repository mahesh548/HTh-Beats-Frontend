import { useContext, useEffect, useReducer, useState } from "react";
import BackButton from "./BackButton";

import utils from "../../../utils";
import { DoNotDisturbOnOutlined } from "@mui/icons-material";
import { HashContext } from "./Hash";
import { useNavigate } from "react-router";

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

export default function EditPlaylist({ editId, title, img, list, saveEdit }) {
  const [editData, setEditData] = useReducer(editReducer, {
    title,
    img,
    list,
  });
  const [changes, setChanges] = useState([]);
  const { close } = useContext(HashContext);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const getIdFromList = (songList) => {
    return songList.map((item) => item.id);
  };
  const sendBackData = () => {
    const changedData = {};
    changes.forEach((item) => {
      changedData[item] = editData[item];
      if (item == "list") {
        changedData.list = getIdFromList(editData.list);
      }
    });
    saveEdit(changedData);
    close(editId);
  };

  useEffect(() => {
    let localChanges = [];
    if (editData.title != title) localChanges.push("title");
    if (editData.img != img) localChanges.push("img");
    if (editData.list.length != list.length) localChanges.push("list");
    setChanges(localChanges);
  }, [editData]);

  const isDesktop = window.innerWidth >= 1000;

  if (isDesktop) {
    return (
      <div className="deskBack contextMenuPart" onClick={() => goBack()}>
        <div className="deskEditCont" onClick={(e) => e.stopPropagation()}>
          <p className="labelText mt-0 text-start w-100">Edit playlist</p>
          <hr className="dividerLine" />
          <div className="editMain mt-2">
            <div className="text-center">
              <img
                src={editData.img}
                style={{ height: "150px", width: "150px" }}
                className="d-block m-auto"
              />
              <button className="iconButton mt-2">Change cover</button>
            </div>
            <div>
              <input
                type="text"
                value={editData.title}
                className=" edInput m-auto"
                onInput={(e) => {
                  setEditData({ type: "title", value: e.target.value });
                }}
                id="playlistEditName"
              />
              <div
                style={{
                  overflow: "scroll",
                  maxHeight: "60dvh",
                  height: "fit-content",
                }}
                className="hiddenScrollbar"
              >
                {editData.list.map((item) => {
                  return (
                    <div
                      className="playlistSong"
                      style={{
                        width: "98%",
                        margin: "15px auto",
                      }}
                      key={`${item.id}_editList`}
                    >
                      <button
                        className="iconButton"
                        style={{ color: "gray", height: "100%", width: "100%" }}
                        onClick={() =>
                          setEditData({ type: "song", id: item.id })
                        }
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
          <div className="text-end">
            <hr className="dividerLine" />
            <button className="iconButton d-inline" onClick={() => goBack()}>
              Close
            </button>
            <button
              className={`addToBut me-1 px-3 py-2 d-inline ms-3 mt-1  ${
                changes.length > 0 ? "opacity-100 cursor-pointer" : "opacity-50"
              }`}
              disabled={changes.length == 0}
              onClick={() => sendBackData()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="floatingPage">
      <div className="editCont hiddenScrollbar">
        <div className="navbarAddTo editNav">
          <BackButton />
          <p>Edit playlist</p>
          <button
            className={`iconButton ${
              changes.length > 0 ? "text-wheat" : "text-white-50"
            }`}
            disabled={changes.length == 0}
            onClick={() => sendBackData()}
          >
            Save
          </button>
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
                  margin: "15px auto",
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
