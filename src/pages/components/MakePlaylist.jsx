import { useContext, useState } from "react";
import { HashContext } from "./Hash";
import utils from "../../../utils";
import { useNavigate } from "react-router";
import { showToast } from "./showToast";

export default function MakePlaylist() {
  const { close } = useContext(HashContext);
  const [playlistName, setPlaylistName] = useState("My playlist");
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const handleCreate = async () => {
    if (playlistName.length > 0) {
      const response = await utils.BACKEND("/create_playlist", "POST", {
        playlistData: {
          title: playlistName,
          song: [],
        },
      });
      if (response.status) {
        showToast({ text: "Playlist created" });
        navigate("/library");
      }
    }
  };

  const isDesktop = window.innerWidth >= 1000;

  if (isDesktop) {
    return (
      <div className="deskBack contextMenuPart" onClick={() => goBack()}>
        <div
          className="deskEditCont"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "350px" }}
        >
          <p className="labelText text-start">Enter your playlist name</p>
          <hr className="dividerLine" />

          <input
            type="text"
            value={playlistName}
            className=" edInput m-auto mt-2 mb-2"
            onInput={(e) => {
              setPlaylistName(e.target.value);
            }}
            id="playlistName"
          />
          <hr className="dividerLine" />
          <div className="text-end">
            <button
              className="iconButton d-inline"
              onClick={() => close("createPlaylist")}
            >
              Cancel
            </button>
            <button
              className={`addToBut me-1 px-3 py-2 d-inline ms-3 mt-1 opacity-100 cursor-pointer `}
              onClick={() => handleCreate()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="floatingPage"
      style={{
        backgroundImage: "linear-gradient(179deg, #f5deb37d, transparent)",
      }}
    >
      <div className="makePCont ">
        <p className="labelText">Enter your playlist name</p>
        <input
          type="text"
          value={playlistName}
          className="iconButton mpInput"
          onInput={(e) => setPlaylistName(e.target.value)}
          id="playlistName"
        />
        <div>
          <button
            className="addToBut mpBut px-5"
            style={{
              background: "transparent",
              color: "white",
              border: "2px solid gray",
            }}
            onClick={() => close("createPlaylist")}
          >
            Cancel
          </button>
          <button
            className="addToBut mpBut px-5"
            onClick={() => handleCreate()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
