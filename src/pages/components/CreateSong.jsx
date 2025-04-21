import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import { songContext } from "./Song";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import OptionSong from "./OptionSong";
import LikeSong from "./LikeSong";
import TimelineSlider from "./TimelineSlider";
import PageLoader from "./PageLoader";
import { showToast } from "./showToast";

export default function CreatePlaylist({ response }) {
  const { openElements } = useContext(HashContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");
  const [isLiked, setIsLiked] = useState(false);
  const [relatedPlaylist, setRelatedPlaylist] = useState(false);

  useEffect(() => {
    setData(response);
    setIsLiked(response.savedIn.length > 0);
  }, [response]);

  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(data.image);

      setBg(color ? color : "#8d8d8d");
    };
    if (data.image) {
      setColor();
    }
  }, [data]);

  const play = () => {
    const playlistEcho = {
      id: data.id,
      title: data.title,
      type: "song",
      list: [data],
    };
    setQueue({
      type: "NEW",
      value: { playlist: playlistEcho, song: data.id, status: "play" },
    });
  };

  //memoizing the like data
  const likeData = useMemo(() => {
    const playlistPreference = localStorage?.preferedPlaylist;
    if (playlistPreference) {
      return {
        type: "song",
        id: [data.id],
        playlistIds: JSON.parse(playlistPreference),
      };
    }
    return null;
  }, []);

  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const handleLocalLike = (obj) => {
    const { savedTo, removedFrom } = obj;
    const newSavedIn = [...new Set([...data.savedIn, ...savedTo])].filter(
      (item2) => !removedFrom.includes(item2)
    );
    setData({ ...data, savedIn: newSavedIn });
    setIsLiked(newSavedIn.length > 0);
  };
  useEffect(() => {
    if (!Queue?.playlist?.list) return;
    if (Queue.playlist.list.some((item) => item.id == data.id)) {
      setIsLiked(Queue.saved.includes(data.id));
    }
  }, [Queue, Queue?.saved, Queue?.playlist?.list]);

  useEffect(() => {
    const getRelated = async () => {
      const response = await utils.API(
        `/related?id=${data.id}&entity=${data.type}`,
        "GET"
      );
      setRelatedPlaylist(response || false);
    };

    getRelated();
  }, [data?.id]);
  const startDownload = async (URL, title) => {
    await utils.downloadThis(URL, title);
  };
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>

      <div className="playlistMain">
        <BackButton />
        <div className="songsCard px-3 mt-4">
          <img src={data.image} alt={data.title} className="songsCardImg" />
          <div>
            <div className="playlistDetails mt-2">
              <p
                className="thinTwoLineText text-white mt-2"
                style={{ fontSize: "18px", fontWeight: "bold" }}
              >
                {utils.refineText(data.title)}
              </p>
              <p className="thinTwoLineText mt-1">
                {utils.refineText(data?.subtitle)}
              </p>
            </div>
            <div className="playlistButtonCont">
              <div>
                <LikeSong
                  styleClass="playlistButtonSecondary"
                  isLiked={isLiked}
                  likeData={likeData}
                  addId={addId}
                  likeClicked={(obj) => handleLocalLike(obj)}
                  key={data.id}
                />
                <button
                  className="playlistButtonSecondary"
                  onClick={() =>
                    startDownload(
                      data.more_info.encrypted_media_url,
                      data.title
                    )
                  }
                >
                  <img src={downloadOutlined} />
                </button>

                <OptionSong
                  styleClass="playlistButtonSecondary"
                  data={data}
                  likeData={likeData}
                  addId={addId}
                >
                  <img src={moreOutlined} />
                </OptionSong>
              </div>
              <div>
                {Queue?.playlist?.id != data.id ||
                Queue?.status == "pause" ||
                Queue?.status == "stop" ? (
                  <button className="playlistButton" onClick={() => play()}>
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
        </div>
        <p className="labelText ps-2 mt-4 mb-2">Featured artist</p>
        <div className="songArtCont">
          {data.more_info.artistMap.artists.map((item) => {
            return (
              <div key={item.id}>
                <img src={item.image} />

                <p className="thinTwoLineText">{utils.refineText(item.name)}</p>
              </div>
            );
          })}
        </div>
        <div className="ps-2 mt-4">
          {relatedPlaylist ? (
            <>
              <TimelineSlider
                label="Related playlists"
                data={relatedPlaylist}
              />
            </>
          ) : (
            <PageLoader />
          )}
        </div>
      </div>

      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={likeData}
            playlistIds={data.savedIn || []}
            results={(obj) => handleLocalLike(obj)}
            eleId={addId}
          />,
          document.body
        )}
    </div>
  );
}
