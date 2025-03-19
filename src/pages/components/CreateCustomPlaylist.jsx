import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import addCollab from "../../assets/icons/addCollab.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import {
  PauseRounded,
  PersonAdd,
  PersonAddOutlined,
  PlayArrowRounded,
} from "@mui/icons-material";
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

export default function CreateCustomPlaylist({ response }) {
  const { openElements, open } = useContext(HashContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");
  useEffect(() => {
    setData(response);
  }, [response.id]);

  useEffect(() => {
    const setColor = async () => {
      const color = await utils.getAverageColor(data.image);

      setBg(color ? color : "#8d8d8d");
    };
    if (data.image) {
      setColor();
    }
  }, [data]);

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };

  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);
  const artId = useMemo(() => {
    return `art_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

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
        <img
          src={data.image}
          alt={data.title}
          className="playlistMainImg"
          ref={ref}
        />
        <div className="playlistDetails">
          <p
            className="thinTwoLineText"
            style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}
          >
            {utils.refineText(data.title)}
          </p>

          <PlaylistOwner
            srcArray={data?.ownerInfo.slice(0, 3).map((item) => item.pic)}
            label={"Owners:"}
            name={data?.ownerInfo[0].username}
            totalOwner={data?.ownerInfo.length}
            action={() => open(artId)}
          />

          <p className="thinTwoLineText">
            {utils.refineText(`${data.list_count} songs`)}
          </p>
        </div>
        <div className="playlistButtonCont">
          <div>
            <OptionEntity
              styleClass="playlistButtonSecondary"
              data={{
                id: data.id,
                title: data.title,
                subtitle: `${data.list_count} songs`,
                image: data.image,
                list: data.list,
              }}
              artists={data.ownerInfo || []}
              addId={addId}
              artId={artId}
              entityType={data.entityType}
            >
              <img src={moreOutlined} />
            </OptionEntity>
            <button className="playlistButtonSecondary">
              <img src={downloadOutlined} />
            </button>

            <button className="playlistButtonSecondary">
              <img src={addCollab} />
            </button>
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
