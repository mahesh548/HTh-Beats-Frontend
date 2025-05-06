import { useContext, useState } from "react";

import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
import PanelOpen from "../../assets/icons/PanelOpen.svg";
import { Add } from "@mui/icons-material";
import { AuthContext } from "./Auth";
import utils from "../../../utils";

export default function QuickAccess() {
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);
  return (
    <div className={`quickCont ${open ? "open" : "closed"}`}>
      <div
        className={`d-flex  justify-content-${open ? "start" : "center"}`}
        style={{ width: "90%", gap: "5px" }}
      >
        <button
          className="iconButton text-center opacity-50"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <img src={PanelOpen} style={{ scale: "0.8" }} />
          ) : (
            <img
              src={PanelOpen}
              style={{ transform: "scaleX(-1)", scale: "0.9" }}
            />
          )}
        </button>
        <p className="labelText m-0">Quick access</p>
      </div>
      <hr className="dividerLine op-10 m-0" />
      <button className="iconButton qaButton">
        <Add />
        <p>Create</p>
      </button>
      <button className="iconButton qaButton">
        <img src={librarySvgOutlined} />
        <p>Your library</p>
      </button>
      <hr className="dividerLine op-10 m-0" />

      {auth?.user?.users_playlists &&
        [
          auth.user.users_playlists.find(
            (item) => item.perma_url == auth?.user?.id
          ),
          ...auth.user.users_playlists.filter(
            (item) => item.perma_url != auth?.user?.id
          ),
        ].map((item, index) => {
          return (
            <button className="qaList" key={"quick-act-" + index}>
              <img src={item.image} />
              <div className="text-start">
                <p className="thinOneLineText playlistSongTitle">
                  {item.title}
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  Playlist{" · "}
                  {utils.checkPlaylistType(
                    { ...item, type: "playlist" },
                    auth.user.id
                  )}
                </p>
              </div>
            </button>
          );
        })}
    </div>
  );
}
