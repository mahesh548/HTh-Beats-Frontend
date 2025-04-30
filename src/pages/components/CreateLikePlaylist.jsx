import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import { Add, PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import PlaylistNavbar from "./PlaylistNavbar";
import { useInView } from "react-intersection-observer";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import DownloadEntity from "./DownloadEntity";
import { Link } from "react-router";

export default function CreateLikePlaylist({ response }) {
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const bg = "#ffcb43";
  useEffect(() => {
    setData(response);
  }, [response]);

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const handleLocalLike = (obj, id = "all") => {
    const { savedTo, removedFrom } = obj;
    if (savedTo.length == 0 && removedFrom.length == 0) return;
    let newList = [];
    if (id == "all") {
      newList = data.list.map((item) => {
        item.savedIn = [...new Set([...item.savedIn, ...savedTo])].filter(
          (item2) => !removedFrom.includes(item2)
        );
        return item;
      });
    } else {
      newList = data.list.map((item) => {
        if (item.id != id) return item;
        item.savedIn = [...new Set([...item.savedIn, ...savedTo])].filter(
          (item2) => !removedFrom.includes(item2)
        );
        return item;
      });
    }

    setData({ ...data, list: newList });
  };

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>

      <div className="playlistMain">
        <PlaylistNavbar
          response={response}
          setData={setData}
          display={inView}
        />

        <BackButton />

        <div className="playlistDetails">
          <p className="labelText fs-1" ref={ref}>
            Liked Songs
          </p>

          <p className="thinTwoLineText">
            {utils.refineText(`${data.list_count || 0} songs`)}
          </p>
        </div>
        <div className="playlistButtonCont">
          <div>
            <DownloadEntity
              styleClass="playlistButtonSecondary"
              data={{
                id: data.id,
                title: data.title,
                list: data.list,
              }}
            >
              <img src={downloadOutlined} />
            </DownloadEntity>
          </div>
          <div>
            {Queue?.playlist?.id != data.id ||
            Queue?.status == "pause" ||
            Queue?.status == "stop" ? (
              <button
                className="playlistButton"
                onClick={() => play(data.list[0].id)}
              >
                <PlayArrowRounded />
              </button>
            ) : (
              <button
                className="playlistButton"
                onClick={() => setQueue({ type: "STATUS", value: "pause" })}
              >
                <PauseRounded />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="songList">
        <Link to="/search" className="text-decoration-none">
          <div className="playlistSong">
            <button
              className="iconButton rounded"
              style={{ background: "#ffffff2e", aspectRatio: "1/1" }}
            >
              <Add className="text-white-50 " />
            </button>
            <div>
              <p className="thinOneLineText playlistSongTitle fs-5 fw-light ">
                Add to this playlist
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="songList">
        {data.list.map((item) => {
          const isLiked = Queue?.saved && Queue?.saved.includes(item.id);
          return (
            <PlaylistSong
              data={item}
              play={play}
              key={item.id}
              isPlaying={item.id == Queue.song}
              isLiked={item.savedIn.length > 0 || isLiked}
              setGlobalLike={handleLocalLike}
            />
          );
        })}
      </div>
    </div>
  );
}
