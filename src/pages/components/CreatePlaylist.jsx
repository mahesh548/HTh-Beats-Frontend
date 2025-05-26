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
import PlaylistOwner from "./PlaylistOwner";
import TimelineSlider from "./TimelineSlider";
import PageLoader from "./PageLoader";
import DownloadEntity from "./DownloadEntity";

export default function CreatePlaylist({ response }) {
  const { openElements, open } = useContext(HashContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [relatedPlaylist, setRelatedPlaylist] = useState(false);
  const [bg, setBg] = useState("#8d8d8d");
  useEffect(() => {
    setData(response);
  }, [response.id]);

  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(data.image);

      setBg(color ? color : "#8d8d8d");
      utils.editMeta("", color ? color : "#8d8d8d");
    };
    if (data.image) {
      setColor();
    }
  }, [data]);

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const [relatedPlaylistRef, relatedPlaylistinView, relatedPlaylistEntry] =
    useInView({
      threshold: 0,
    });

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

  useEffect(() => {
    const getRelated = async () => {
      const response = await utils.API(
        `/related?id=${data.id}&entity=${data.type}`,
        "GET"
      );
      setRelatedPlaylist(response || false);
    };
    if (!relatedPlaylist && relatedPlaylistEntry && data.type != "mix") {
      getRelated();
    }
  }, [relatedPlaylistinView]);

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`${data?.title}`);
    }
  }
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>

      <div className="playlistMain dp-s">
        <PlaylistNavbar
          response={response}
          setData={setData}
          display={inView}
        />

        <BackButton styleClass="mobo" />
        <img
          src={data.image.replace("150x150", "500x500")}
          alt={data.title}
          className="playlistMainImg"
          ref={ref}
        />
        <div className="playlistDetails">
          <h1 className="desk thinOneLineText playlistHeader">
            {utils.refineText(data.title)}
          </h1>
          <p className="thinTwoLineText">
            {utils.refineText(data.header_desc || data.title)}
          </p>

          <PlaylistOwner
            srcArray={data?.more_info?.artists
              .slice(0, 3)
              .map((item) => item.image)}
            label={"Artists:"}
            name={data?.more_info?.artists[0].name}
            totalOwner={data?.more_info?.artists.length}
            action={() => open(artId)}
          />

          <p className="thinTwoLineText">
            {utils.refineText(data.more_info?.subtitle_desc.join(" • "))}
          </p>
        </div>
        <div className="playlistButtonCont">
          <div>
            <LikeEntity
              isLiked={data.isLiked}
              styleClass="playlistButtonSecondary"
              likeData={likeData}
            />
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

            <OptionEntity
              styleClass="playlistButtonSecondary"
              data={{
                id: data.id,
                title: data.title,
                subtitle: data.header_desc,
                image: data.image,
                list: data.list,
                perma_url: data.perma_url,
                type: data.type,
              }}
              artists={data.more_info.artists || []}
              addId={addId}
              artId={artId}
            >
              <img src={moreOutlined} />
            </OptionEntity>
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
        <div className="desk listInfo">
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "50px 1fr 1fr 1fr 40px 40px",
              columnGap: "15px",
            }}
          >
            <div></div>
            <p className="thinOneLineText playlistSongSubTitle">Title</p>
            <p className="thinOneLineText playlistSongSubTitle">Album</p>
            <p className="thinOneLineText playlistSongSubTitle text-center">
              Duration
            </p>
          </div>
          <hr className="dividerLine mb-4" />
        </div>
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
      {data.entityType != "viewOnly" && (
        <div className="ps-1 mt-4" ref={relatedPlaylistRef}>
          {relatedPlaylist ? (
            <>
              <TimelineSlider
                label="Related playlists"
                data={relatedPlaylist}
              />
            </>
          ) : (
            data.type != "mix" && <PageLoader />
          )}
        </div>
      )}

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
