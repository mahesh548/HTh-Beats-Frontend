import {
  GroupOutlined,
  MoreVertRounded,
  NextPlanOutlined,
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
import { arrayMoveImmutable } from "array-move";

export default function OptionSong({ styleClass, data, addId }) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen } = useContext(HashContext);

  const eleId = useMemo(() => {
    return `more_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const playNext = () => {
    close(eleId);
    if (!Queue.song) return;
    const currentIndex = Queue.playlist.list.indexOf(
      utils.getItemFromId(Queue.song, Queue.playlist.list)
    );
    if (Queue.playlist.list.indexOf(data) != -1) {
      const newList = arrayMoveImmutable(
        Queue.playlist.list,
        Queue.playlist.list.indexOf(data),
        currentIndex + 1
      );
      setQueue({
        type: "PLAYLIST",
        value: { ...Queue.playlist, list: newList },
      });
      return;
    }
    if (
      Queue.playlist.list.indexOf(data) != currentIndex + 1 &&
      Queue.playlist.list.indexOf(data) != currentIndex
    ) {
      let newList = [...Queue.playlist.list];
      newList.splice(currentIndex + 1, 0, data);

      setQueue({
        type: "PLAYLIST",
        value: { ...Queue.playlist, list: newList },
      });
    }
  };

  return (
    <>
      <button className={styleClass} onClick={() => open(eleId)}>
        <MoreVertRounded />
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
                  : utils.refineText(
                      `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                    )}
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
          <button className="icoTextBut" onClick={() => playNext()}>
            <NextPlanOutlined />
            <p>Play next</p>
          </button>
          <button className="icoTextBut">
            <PlaylistAddOutlined />
            <p>Add to queue</p>
          </button>
          <button className="icoTextBut">
            <GroupOutlined />
            <p>Listen to artist</p>
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
