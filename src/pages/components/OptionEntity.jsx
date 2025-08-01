import {
  Delete,
  DeleteOutline,
  Edit,
  Lock,
  LockOpenOutlined,
  LockOutlined,
  PlaylistAddOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useContext, useMemo } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import utils from "../../../utils";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import { songContext } from "./Song";
import { showToast } from "./showToast";
import { useNavigate } from "react-router";

export default function OptionEntity({
  children,
  styleClass,
  data,
  addId,
  artId,
  artists,
  entityType = "entity",
  delId = "none",
  editId = "none",
  saveEdit = () => {},
  owner = false,
  privacy = false,
}) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const navigate = useNavigate();

  const eleId = useMemo(() => {
    return `more_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const toggleQueue = () => {
    close(eleId);
    if (!Queue.song || !Queue.playlist) return;
    const newList = [
      ...new Map(
        [...Queue.playlist.list, ...data.list].map((item) => [item.id, item])
      ).values(),
    ];

    setQueue({
      type: "PLAYLIST",
      value: { ...Queue.playlist, list: newList },
    });
  };
  const openArtist = (perma_url) => {
    if (!perma_url || perma_url?.length == 0) return;
    const artistId = perma_url.split("/").pop();
    navigate(`/artist/${artistId}`);
  };
  const share = (type, perma_url) => {
    const isDesktop = window.innerWidth >= 1000;
    const shareUrl = "https://hthbeats.online/" + type + "/" + perma_url;
    if (isDesktop || !navigator.share) {
      navigator.clipboard.writeText(shareUrl);
      showToast({
        text: "Link copied to clipboard",
      });
    } else {
      navigator.share({
        url: shareUrl,
      });
    }
  };

  return (
    <>
      <button className={styleClass} onClick={() => open(eleId)}>
        {children}
      </button>

      <OffCanvas
        open={openElements.includes(eleId)}
        dismiss={() => close(eleId)}
      >
        <div className="prevCont">
          <div
            className="playlistSong mobo"
            style={{
              width: "95%",
              margin: "auto",
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            <img
              src={data.image}
              alt={data.title}
              className="playlistSongImg"
            />
            <div>
              <p className="thinOneLineText playlistSongTitle">
                {utils.refineText(data.title)}
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                {data.subtitle?.length != 0
                  ? utils.refineText(data.subtitle)
                  : utils.refineText(data.title)}
              </p>
            </div>
            <div></div>
            <div></div>
          </div>
          <button
            className="icoTextBut"
            onClick={() => {
              close(eleId);
              setTimeout(() => {
                closeOpen(eleId, addId);
              }, 500);
            }}
          >
            <img src={likeOutlined} />
            <p>Add songs to other playlists</p>
          </button>

          <button className="icoTextBut" onClick={() => toggleQueue()}>
            <PlaylistAddOutlined />
            <p>Add songs to queue</p>
          </button>

          {owner && (
            <>
              <button
                className="icoTextBut"
                onClick={() => closeOpen(eleId, delId)}
              >
                <DeleteOutline />
                <p>Delete playlist</p>
              </button>
              <button
                className="icoTextBut"
                onClick={() => closeOpen(eleId, editId)}
              >
                <Edit />
                <p>Edit playlist</p>
              </button>
              <button
                className="icoTextBut"
                onClick={() => {
                  saveEdit({ privacy: privacy ? "private" : "public" });
                  close(eleId);
                }}
              >
                {privacy ? <LockOutlined /> : <LockOpenOutlined />}

                <p>Make it {privacy ? "private" : "public"}</p>
              </button>
            </>
          )}

          <button
            className="icoTextBut"
            onClick={() => share(data.type, data.perma_url)}
          >
            <ShareOutlined />
            <p>Share</p>
          </button>
          <button className="icoTextBut">
            <img src={downloadOutlined} />
            <p>Download</p>
          </button>
        </div>
      </OffCanvas>

      {entityType != "private" && entityType != "collab" && (
        <OffCanvas
          open={openElements.includes(artId)}
          dismiss={() => close(artId)}
        >
          <div className="prevCont">
            <b className="offCanvasTitle">Artists</b>
            {artists.map((item) => {
              return (
                <div
                  className="playlistSong"
                  style={{
                    width: "95%",
                    margin: "auto",
                    marginTop: "10px",
                    marginBottom: "25px",
                    cursor: "pointer",
                  }}
                  onClick={() => openArtist(item?.perma_url)}
                  key={`${item.name}_${item.id}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="playlistSongImg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name
                      )}&bold=true&background=f5deb3&length=1&font-size=0.6`;
                    }}
                  />
                  <div>
                    <p className="thinOneLineText playlistSongTitle">
                      {utils.refineText(item.name)}
                    </p>
                    <p className="thinOneLineText playlistSongSubTitle">
                      {item.role || "artist"}
                    </p>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              );
            })}
          </div>
        </OffCanvas>
      )}
      {(entityType == "private" || entityType == "collab") && (
        <OffCanvas
          open={openElements.includes(artId)}
          dismiss={() => close(artId)}
        >
          <div className="prevCont">
            <b className="offCanvasTitle">Owners</b>
            {artists.map((item) => {
              return (
                <div
                  className="playlistSong"
                  style={{
                    width: "95%",
                    margin: "auto",
                    marginTop: "10px",
                    marginBottom: "25px",
                  }}
                  key={`${item.username}_playlistOwner`}
                >
                  <img src={item.pic} className="playlistSongImg rounded" />
                  <div className="extendedGrid">
                    <p className="thinOneLineText playlistSongTitle">
                      {utils.refineText(item.username)}
                    </p>
                    <p className="thinOneLineText playlistSongSubTitle">
                      {`Playlist ${item.role}`}
                    </p>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              );
            })}
          </div>
        </OffCanvas>
      )}
    </>
  );
}
