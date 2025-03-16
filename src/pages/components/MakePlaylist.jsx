import { useContext, useState } from "react";
import { HashContext } from "./Hash";

export default function MakePlaylist() {
  const { close } = useContext(HashContext);
  const [playlistName, setPlaylistName] = useState("My playlist");
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
          <button className="addToBut mpBut px-5" onClick={() => alert()}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
