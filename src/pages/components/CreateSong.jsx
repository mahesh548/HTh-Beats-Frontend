import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import LikeEntity from "./LikeEntity";
import OptionEntity from "./OptionEntity";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import PlaylistOwner from "./PlaylistOwner";

export default function CreatePlaylist({ response }) {
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
    id: [response?.id],
    type: "song",
  };

  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);
  const artId = useMemo(() => {
    return `art_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="backgroundGradient" style={{ backgroundColor: bg }}></div>

      <div className="playlistMain">
        <BackButton />
        <img src={data.image} alt={data.title} className="playlistMainImg" />
        <div className="playlistDetails">
          <p className="thinTwoLineText">{utils.refineText(data.subtitle)}</p>

          <PlaylistOwner
            srcArray={data.more_info?.artistMap?.artists
              .slice(0, 3)
              .map((item) => item.image)}
            label={"Artists:"}
            name={data?.more_info?.artistMap?.artists[0].name}
            totalOwner={data?.more_info?.artistMap?.artists.length}
            action={() => open(artId)}
          />

          <p className="thinTwoLineText">{utils.refineText(data?.subtitle)}</p>
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
                title: data.title,
                subtitle: data.header_desc,
                image: data.image,
                list: data.list,
              }}
              artists={data.more_info.artistMap.artists || []}
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
