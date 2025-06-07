import {
  AlbumOutlined,
  GroupOutlined,
  NextPlanOutlined,
  PlaylistAddOutlined,
  PlaylistRemoveOutlined,
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
import { showToast } from "./showToast";

export default function OptionSong({ children, styleClass, data, addId }) {
  const { Queue, setQueue } = useContext(songContext);
  const { openElements, open, close, closeOpen } = useContext(HashContext);

  const eleId = useMemo(() => {
    return `more_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);
  const artId = useMemo(() => {
    return `art_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const playNext = () => {
    close(eleId);
    //if no song is playing then return
    if (!Queue.song) return;

    //get current song index
    const currentIndex = Queue.playlist.list.indexOf(
      utils.getItemFromId(Queue.song, Queue.playlist.list)
    );
    // if song already in queue then move it to next
    if (Queue.playlist.list.some((item) => item.id == data.id)) {
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
    // if song is not in queue then add it to next
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
    showToast({ text: "Queue updated" });
  };

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
    showToast({ text: "Queue updated" });
  };
  const artists = [
    ...new Map(
      data.more_info.artistMap.artists.map((item) => [item["id"], item])
    ).values(),
  ];

  const startDownload = async (URL, title) => {
    setTimeout(async () => {
      await utils.downloadThis(URL, title);
    }, 1000);
    close(eleId);
  };
  const share = (perma_url) => {
    const isDesktop = window.innerWidth >= 1000;
    const shareUrl =
      "https://hthbeats.vercel.app/api/preview?type=song" + "&id=" + perma_url;
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

          {Queue?.playlist &&
          Queue.playlist.list.some((item) => item.id == data.id) ? (
            <button className="icoTextBut" onClick={() => toggleQueue()}>
              <PlaylistRemoveOutlined />
              <p>Remove from queue</p>
            </button>
          ) : (
            <button className="icoTextBut" onClick={() => toggleQueue()}>
              <PlaylistAddOutlined />
              <p>Add to queue</p>
            </button>
          )}

          <button
            className="icoTextBut"
            onClick={() => {
              close(eleId);
              setTimeout(() => {
                closeOpen(eleId, artId);
              }, 500);
            }}
          >
            <GroupOutlined />
            <p>Listen to artist</p>
          </button>
          {data?.more_info?.album_url && (
            <button className="icoTextBut">
              <AlbumOutlined />
              <p>View album</p>
            </button>
          )}
          <button className="icoTextBut" onClick={() => share(data.perma_url)}>
            <ShareOutlined />
            <p>Share</p>
          </button>
          <button
            className="icoTextBut"
            onClick={() =>
              startDownload(data?.more_info?.encrypted_media_url, data.title)
            }
          >
            <img src={downloadOutlined} />
            <p>Download</p>
          </button>
        </div>
      </OffCanvas>

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
                }}
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
    </>
  );
}
