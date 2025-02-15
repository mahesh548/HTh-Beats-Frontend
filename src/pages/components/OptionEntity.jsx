import { PlaylistAddOutlined, ShareOutlined } from "@mui/icons-material";
import { useContext, useMemo } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import utils from "../../../utils";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import { songContext } from "./Song";

export default function OptionEntity({ children, styleClass, data, addId }) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen } = useContext(HashContext);

  const eleId = useMemo(() => {
    return `more_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const toggleQueue = () => {
    close(eleId);
    if (!Queue.song || data.id == Queue.song) return;
    const newList =
      Queue.playlist.list.indexOf(data) != -1
        ? Queue.playlist.list.filter((item) => item.id != data.id)
        : [...Queue.playlist.list, data];
    setQueue({
      type: "PLAYLIST",
      value: { ...Queue.playlist, list: newList },
    });
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
            className="playlistSong"
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
            <p>Add to playlists</p>
          </button>

          <button className="icoTextBut" onClick={() => toggleQueue()}>
            <PlaylistAddOutlined />
            <p>Add to queue</p>
          </button>

          <button className="icoTextBut">
            <ShareOutlined />
            <p>Share</p>
          </button>
          <button className="icoTextBut">
            <img src={downloadOutlined} />
            <p>Download</p>
          </button>
        </div>
      </OffCanvas>
    </>
  );
}
