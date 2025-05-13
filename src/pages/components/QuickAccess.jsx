import { useContext, useState } from "react";

import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";
import PanelOpen from "../../assets/icons/PanelOpen.svg";
import { Add } from "@mui/icons-material";
import { AuthContext } from "./Auth";
import utils from "../../../utils";
import { useNavigate } from "react-router";
import { HashContext } from "./Hash";

export default function QuickAccess() {
  const [panelOpen, setOpen] = useState(false);
  const auth = useContext(AuthContext);
  const { openElements, close, open, closeOpen } = useContext(HashContext);
  const navigate = useNavigate();
  let recentData = JSON.parse(localStorage?.recent || "[]");
  recentData = [...new Map(recentData.map((item) => [item.id, item])).values()];
  const recents = recentData
    .filter((item) => item.data)
    .sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .map((item) => item.data);

  const openPlaylist = (id) => {
    navigate(`/playlist/${id}`);
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={`quickCont ${panelOpen ? "open" : "closed"}`}>
      <div
        className={`d-flex  justify-content-${panelOpen ? "start" : "center"}`}
        style={{ width: "90%", gap: "5px" }}
      >
        <button
          className="iconButton text-center opacity-50"
          onClick={() => setOpen(!panelOpen)}
        >
          {panelOpen ? (
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
      <button
        className="iconButton qaButton"
        onClick={() => open("createOption")}
      >
        <Add />
        <p>Create</p>
      </button>
      <button
        className={`iconButton qaButton ${
          isActive("/library") && "qaButtonActive"
        }`}
        onClick={() => navigate("/library")}
      >
        <img src={librarySvgOutlined} />
        <p>Your library</p>
      </button>
      <hr className="dividerLine op-10 m-0" />
      <p
        className="text-white-50 text-start w-100 ps-4 fw-light qh"
        style={{ fontSize: "0.9rem" }}
      >
        Your playlists
      </p>
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
            <button
              className="qaList"
              key={"quick-act-" + index}
              onClick={() => openPlaylist(item?.perma_url)}
            >
              <img src={item.image} />
              <div className="text-start">
                <p className="thinOneLineText playlistSongTitle fw-light">
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
      {recents.length > 0 && (
        <>
          <hr className="dividerLine op-10 m-0" />{" "}
          <p
            className="text-white-50 text-start w-100 ps-4 fw-light qh"
            style={{ fontSize: "0.9rem" }}
          >
            Recents
          </p>
        </>
      )}
      {recents.length > 0 &&
        recents.map((item, index) => {
          return (
            <button
              className="qaList"
              key={"quick-rec-" + index}
              onClick={() => openPlaylist(item?.perma_url)}
            >
              <img src={item.image} />
              <div className="text-start">
                <p className="thinOneLineText playlistSongTitle fw-light">
                  {item.title}
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  {utils.capitalLetter(item.type)}
                </p>
              </div>
            </button>
          );
        })}
      <div className="w-100" style={{ height: "1rem" }}></div>
    </div>
  );
}
