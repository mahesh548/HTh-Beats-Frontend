import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import { useInView } from "react-intersection-observer";
import PlaylistNavbar from "./PlaylistNavbar";
import LikeEntity from "./LikeEntity";
import OptionEntity from "./OptionEntity";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import TimelineSlider from "./TimelineSlider";

export default function CreateArtist({ response }) {
  const { openElements, open } = useContext(HashContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");
  useEffect(() => {
    setData(response);
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

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };

  const likeData = {
    id: response?.id,
    type: "entity",
  };

  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);
  const artId = useMemo(() => {
    return `art_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const songsLikeData = {
    id: data.list.map((item) => item.id),
    type: "song",
  };

  const playlistInCommon = useMemo(() => {
    const idArray = data.list[0].savedIn.filter((item) => {
      let isIncluded = true;
      data.list.forEach((song) => {
        if (!song.savedIn.includes(item)) {
          isIncluded = false;
        }
      });
      return isIncluded;
    });
    return idArray;
  }, [data.list]);

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
      <div className="artistCover">
        <img src={data.image} alt={data.name} className="playlistMainImg" />
        <p>{data.name}</p>
      </div>

      <div className="playlistMain mt-0">
        <BackButton />
        <div className="bg-black">
          <div className="playlistDetails " style={{ marginTop: "44.44%" }}>
            <p className="thinTwoLineText">
              {utils.refineText(data?.subtitle_desc)}
            </p>
          </div>
          <div className="playlistButtonCont">
            <div>
              <LikeEntity
                isLiked={data.isLiked}
                styleClass="playlistButtonSecondary"
                likeData={likeData}
              />
              <button className="playlistButtonSecondary">
                <img src={downloadOutlined} />
              </button>

              <OptionEntity
                styleClass="playlistButtonSecondary"
                data={{
                  id: data.id,
                  title: data.name,
                  subtitle: data.header_desc,
                  image: data.image,
                  list: data.list,
                }}
                artists={
                  [
                    {
                      id: data.id,
                      image: data.image,
                      name: data.name,
                      perma_url: data.perma_url,
                      role: data?.dominantType || "singer",
                      type: "artist",
                    },
                  ] || []
                }
                addId={addId}
                artId={artId}
              >
                <img src={moreOutlined} />
              </OptionEntity>
            </div>
            <div>
              {Queue?.playlist?.id == data.id && Queue.status != "pause" ? (
                <button
                  className="playlistButton"
                  onClick={() => setQueue({ type: "STATUS", value: "pause" })}
                >
                  <PauseRounded />
                </button>
              ) : (
                <button
                  className="playlistButton"
                  onClick={() => play(data.list[0].id)}
                >
                  <PlayArrowRounded />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="songList pt-4 bg-black" style={{ marginTop: "-11px" }}>
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

      {openElements.includes(addId) &&
        createPortal(
          <AddToPlaylist
            likeData={songsLikeData}
            playlistIds={playlistInCommon}
            results={(obj) => handleLocalLike(obj)}
            eleId={addId}
          />,
          document.body
        )}
    </div>
  );
}
