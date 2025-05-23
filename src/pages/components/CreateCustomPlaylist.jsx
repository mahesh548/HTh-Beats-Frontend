import { useContext, useEffect, useMemo, useState } from "react";
import utils from "../../../utils";
import BackButton from "./BackButton";

import addCollab from "../../assets/icons/addCollab.svg";
import moreOutlined from "../../assets/icons/moreOutlined.svg";
import {
  LogoutOutlined,
  PauseRounded,
  PlayArrowRounded,
  Add,
} from "@mui/icons-material";
import PlaylistSong from "./PlaylistSong";
import { songContext } from "./Song";
import { useInView } from "react-intersection-observer";
import PlaylistNavbar from "./PlaylistNavbar";
import OptionEntity from "./OptionEntity";
import { createPortal } from "react-dom";
import AddToPlaylist from "./AddToPlaylist";
import { HashContext } from "./Hash";
import PlaylistOwner from "./PlaylistOwner";
import { AuthContext } from "./Auth";
import ConfirmPrompt from "./ConfirmPrompt";
import { useNavigate } from "react-router";
import EditPlaylist from "./EditPlaylist";
import ManageOwner from "./ManageOwner";
import { showToast } from "./showToast";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";
import DownloadEntity from "./DownloadEntity";
import { Link } from "react-router";

export default function CreateCustomPlaylist({ response }) {
  const { openElements, open } = useContext(HashContext);
  const auth = useContext(AuthContext);
  const [data, setData] = useState(response);
  const { Queue, setQueue } = useContext(songContext);
  const [bg, setBg] = useState("#8d8d8d");
  const navigate = useNavigate();
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

  const play = (id) => {
    setQueue({
      type: "NEW",
      value: { playlist: { ...data }, song: id, status: "play" },
    });
  };

  // id to show addToPlaylist container
  const addId = useMemo(() => {
    return `add_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  // id to show artist/owner bottom sheet
  const artId = useMemo(() => {
    return `art_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  // id to show confirm prompt for deleting playlist
  const delId = useMemo(() => {
    return `del_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  // id to show edit playlist container
  const editId = useMemo(() => {
    return `edit_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);
  // id to show manage playlist owner container
  const ownerId = useMemo(() => {
    return `owners_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
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
  const deletePlaylist = async () => {
    const likeData = { id: data.id, type: "entity" };
    const response = await utils.BACKEND("/save", "DELETE", {
      savedData: likeData,
    });
    if (response.delete) {
      navigate("/library");
    }
  };

  const saveEdit = async (changedData) => {
    changedData.id = data.id;
    const response = await utils.BACKEND("/edit_playlist", "POST", {
      editData: changedData,
    });
    if (response?.status) {
      let newData = data;
      if (changedData?.title) newData.title = changedData.title;
      if (changedData?.img) newData.image = changedData.img;
      if (changedData?.list)
        newData.list = newData.list.filter((item) =>
          changedData.list.includes(item.id)
        );
      if (changedData?.members)
        newData.ownerInfo = newData.ownerInfo.filter((item) =>
          changedData.members.includes(item.id)
        );
      showToast({ text: "Playlist updated" });
      if (changedData?.invite) {
        navigator.clipboard.writeText(
          `https://${location.host}/collab/${response.token}`
        );
        showToast({ text: "Link copied to clipboard" });
      }
      if (changedData?.privacy && changedData.privacy == "private") {
        showToast({ text: "Playlist is now private" });
        newData.userId = newData.userId.filter((item) => item != "viewOnly");
      }

      if (changedData?.privacy && changedData.privacy == "public") {
        showToast({ text: "Playlist is now public" });
        newData.userId = newData.userId.filter((item) => item != "viewOnly");
        newData.userId.push("viewOnly");
      }

      setData(newData);
    }
  };

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`${data?.title}`);
    }
  }

  const delText =
    data.owner == auth?.user?.id
      ? {
          body: `You want to delete "${data.title}" playlist.`,
          butText: "Delete playlist",
        }
      : {
          body: `You want to leave ${data.title}" playlist collab.`,
          butText: "Leave collab",
        };

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
          src={data.image}
          alt={data.title}
          className="playlistMainImg"
          ref={ref}
        />
        <div className="playlistDetails">
          <h1 className="desk thinOneLineText playlistHeader">
            {utils.refineText(data.title)}
          </h1>
          <p
            className="thinTwoLineText mobo"
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
              privacy={data.userId.includes("viewOnly")}
              owner={data.owner == auth?.user?.id}
              delId={delId}
              editId={editId}
              saveEdit={saveEdit}
            >
              <img src={moreOutlined} />
            </OptionEntity>
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

            {data.owner == auth?.user?.id ? (
              <button
                className="playlistButtonSecondary"
                onClick={() => open(ownerId)}
              >
                <img src={addCollab} />
              </button>
            ) : (
              <button
                className="playlistButtonSecondary leaveCollab"
                onClick={() => open(delId)}
              >
                <LogoutOutlined />
              </button>
            )}
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
      <div
        className="songList"
        style={{ display: data.list.length > 0 ? "block" : "none" }}
      >
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
      {openElements.includes(editId) &&
        createPortal(
          <EditPlaylist
            title={data.title}
            list={data.list}
            img={data.image}
            saveEdit={saveEdit}
            editId={editId}
          />,
          document.body
        )}
      {openElements.includes(ownerId) &&
        createPortal(
          <ManageOwner
            ownerInfo={data.ownerInfo}
            saveEdit={saveEdit}
            ownerId={ownerId}
          />,
          document.body
        )}
      {openElements.includes(delId) &&
        createPortal(
          <ConfirmPrompt
            id={delId}
            title="Are you sure?"
            body={delText.body}
            butText={delText.butText}
            onConfirm={deletePlaylist}
          />,
          document.body
        )}
    </div>
  );
}
