import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import {
  PauseRounded,
  PlayArrowRounded,
  ArrowBack,
  VerifiedRounded,
} from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import { useInView } from "react-intersection-observer";
import LikeEntity from "./LikeEntity";
import OptionEntity from "./OptionEntity";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import TimelineSlider from "./TimelineSlider";
import { Link, useNavigate } from "react-router";
//icons
import fb from "../../assets/icons/fb.svg";
import twitter from "../../assets/icons/twitter.svg";
import wiki from "../../assets/icons/wiki.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import DownloadEntity from "./DownloadEntity";
import Reels from "./Reels";
import ReelButton from "./ReelButton";

export default function CreateArtist({ response }) {
  const navigate = useNavigate();
  const { openElements, open } = useContext(HashContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");

  const [showAll, setShowAll] = useState({
    songs: data?.list?.length < 10,
    albums: data?.topAlbums?.length < 10,
  });
  useEffect(() => {
    setData(response);
  }, [response]);

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

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };

  const likeData = {
    id: response?.id,
    type: "artist",
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
  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`${data?.name}`);
    }
  }

  const playReel = () => {
    setQueue({ type: "STATUS", value: "pause" });
    setTimeout(() => {
      open("reels");
    }, 300);
  };

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="artistCover mobo">
        <img src={data.image} alt={data.name} className="playlistMainImg" />
        <p>{data.name}</p>
      </div>
      <div className="playlistMain mt-0">
        <div
          className="playlistNavbar"
          style={{
            backgroundColor: bg,
            display: !inView ? "grid" : "none",
          }}
        >
          <button className="iconButton mobo" onClick={() => navigate(-1)}>
            <ArrowBack />
          </button>

          <div className="playlistNavbarInfo">
            <p className="thinOneLineText playlistTitle">{data?.name}</p>
          </div>
        </div>
        <BackButton styleClass="mobo" />
        <div
          className="bg-black desk-artist-cover dp-s dp-t"
          style={{
            backgroundImage: `linear-gradient(180deg, ${bg.replace(
              ")",
              ",0.3)"
            )} 0% 35%, transparent 100%)`,
          }}
        >
          <img
            src={data.image.replace("150x150", "500x500")}
            alt={data.title}
            className="playlistMainImg desk rounded-circle"
            ref={ref}
          />
          <div
            className="playlistDetails py-1"
            style={{ marginTop: "50%" }}
            ref={ref}
          >
            <h1 className="desk thinOneLineText playlistHeader">
              {utils.refineText(data.name)}
            </h1>
            <p className="thinTwoLineText">
              {utils.refineText(data?.subtitle_desc)}
            </p>
          </div>
          <div className="playlistButtonCont">
            <div>
              <ReelButton
                data={data?.list?.[0] || null}
                open={() => playReel()}
              />
              <LikeEntity
                isLiked={data.isLiked}
                styleClass="playlistButtonSecondary"
                likeData={likeData}
              />
              <DownloadEntity
                styleClass="playlistButtonSecondary"
                data={{
                  id: data.id,
                  title: data.name,
                  list: data.list,
                }}
              >
                <img src={downloadOutlined} />
              </DownloadEntity>

              <OptionEntity
                styleClass="playlistButtonSecondary"
                data={{
                  id: data.id,
                  title: data.name,
                  subtitle: data?.subtitle || "",
                  image: data.image,
                  list: data.list,
                  perma_url: data.perma_url,
                  type: "artist",
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
      </div>
      <div className="songList pt-2 bg-black" style={{ marginTop: "-11px" }}>
        <div
          className="overflow-hidden "
          style={{ height: showAll.songs ? "" : "500px" }}
        >
          <p className="labelText ps-1 mb-1">Popular songs</p>
          <div className="desk listInfo mt-4">
            <div
              className="d-grid"
              style={{
                gridTemplateColumns: "75px 1fr 1fr 1fr 40px 40px",
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
          {data.list.map((item, index) => {
            const isLiked = Queue?.saved && Queue?.saved.includes(item.id);
            return (
              <div className="sortPlaylistSong" key={"wrap-" + item.id}>
                <p className="text-white ps-1 fw-light">{index + 1}</p>
                <PlaylistSong
                  data={item}
                  play={play}
                  key={item.id}
                  isPlaying={item.id == Queue.song}
                  isLiked={item.savedIn.length > 0 || isLiked}
                  setGlobalLike={handleLocalLike}
                />
              </div>
            );
          })}
        </div>
        {!showAll.songs && (
          <>
            <div className="fade-shadow"></div>
            <button
              className="iconButton outlineBut"
              onClick={() => setShowAll({ ...showAll, songs: true })}
            >
              Show more
            </button>
          </>
        )}
        {data?.topAlbums && (
          <>
            <div
              className="overflow-hidden "
              style={{ height: showAll.albums ? "" : "500px" }}
            >
              <p className="labelText ps-1 mb-1">Popular albums</p>

              {data.topAlbums.map((album, index) => {
                return (
                  <div className="sortPlaylistSong" key={"wrap-" + album.id}>
                    <p className="text-white ps-1 fw-light">{index + 1}</p>
                    <div
                      className="playlistSong albumList"
                      onClick={() =>
                        navigate(`/album/${album.perma_url.split("/").at(-1)}`)
                      }
                    >
                      <img src={album.image} className="playlistSongImg" />
                      <div>
                        <p className="thinOneLineText playlistSongTitle">
                          {utils.refineText(album.title)}
                        </p>
                        <p className="thinOneLineText playlistSongSubTitle">
                          {utils.refineText(album.subtitle)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!showAll.albums && (
              <>
                <div className="fade-shadow"></div>
                <button
                  className="iconButton outlineBut"
                  onClick={() => setShowAll({ ...showAll, albums: true })}
                >
                  Show more
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div
        className="bg-black pt-4 desk-no-black"
        style={{ marginTop: "-5px" }}
      >
        <div className="ps-2">
          {data?.singles && (
            <TimelineSlider label="Popular releases" data={data.singles} />
          )}
          {data?.latest_release && (
            <TimelineSlider
              label="Latest releases"
              data={data.latest_release}
            />
          )}
          {data?.featured_artist_playlist && (
            <TimelineSlider
              label={`Featuring ${data.name}`}
              data={data.featured_artist_playlist}
            />
          )}
        </div>

        <div
          className="card bg-dark text-white mx-auto mt-5 mb-5 desk-art-card"
          style={{ width: "95%" }}
        >
          <img src={data.image} className="card-img artC" alt={data.name} />
          <div className="card-img-overlay" style={{ background: "#00000078" }}>
            <h5 className="card-title">
              {data.name}{" "}
              {data?.isVerified == "true" && (
                <VerifiedRounded className="fs-5 text-wheat" />
              )}
            </h5>
            <div className="artCovContent">
              <p className="fs-5">{`${utils.formatMetric(
                data?.fan_count || data?.follower_count
              )} Fans`}</p>
              <p className="thinThreeLineText text-white mt-1">
                {data?.bio[0]?.text || ""}
              </p>
              <div className="socCont">
                {data?.fb && (
                  <button className="iconButton">
                    <Link
                      to={data.fb}
                      target="_"
                      className="text-white text-decoration-none"
                    >
                      <img src={fb} />
                      <span>Facebook</span>
                    </Link>
                  </button>
                )}
                {data?.twitter && (
                  <button className="iconButton">
                    <Link
                      to={data.twitter}
                      target="_"
                      className="text-white text-decoration-none"
                    >
                      <img src={twitter} />
                      <span>Twitter</span>
                    </Link>
                  </button>
                )}
                {data?.wiki && (
                  <button className="iconButton">
                    <Link
                      to={data.twitter}
                      target="_"
                      className="text-white text-decoration-none"
                    >
                      <img src={wiki} />
                      <span>Wikipedia</span>
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="ps-2">
          {data?.dedicated_artist_playlist && (
            <TimelineSlider
              label="Artist's dedicated playlist"
              data={data.dedicated_artist_playlist}
            />
          )}
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
      {openElements.includes("reels") &&
        createPortal(
          <Reels data={data} setGlobalLike={handleLocalLike} play={play} />,
          document.body
        )}
    </div>
  );
}
