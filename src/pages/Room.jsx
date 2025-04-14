import React from "react";
import { useContext, useMemo } from "react";
import BackButton from "./components/BackButton";
import PlaylistOwner from "./components/PlaylistOwner";
import { channelContext } from "./components/Channel";
import { useNavigate } from "react-router";
import utils from "../../utils";
import { songContext } from "./components/Song";
import { createPortal } from "react-dom";
import ConfirmPrompt from "./components/ConfirmPrompt";
import { HashContext } from "./components/Hash";
import Emoji from "./components/Emoji";
import OffCanvas from "./components/BottomSheet";
import Stickers from "./components/Stickers";
import { IosShareOutlined } from "@mui/icons-material";
import QrCode from "./components/QrCode";

export default function Room() {
  const {
    members,
    roomInfo,
    channel,
    currentSong,
    playState,
    disconnect,
    defaultUser,
    messages,
  } = useContext(channelContext);
  const { Queue } = useContext(songContext);
  const navigate = useNavigate();
  const { openElements, open, close } = useContext(HashContext);
  if (!channel) navigate("/home");
  const data = useMemo(() => {
    if (Queue.song && Queue.playlist) {
      return utils.getItemFromId(Queue?.song, Queue?.playlist?.list);
    }
  }, [Queue?.song, Queue?.playlist]);

  const endId = useMemo(() => {
    return `end_${Math.random().toString(36).substr(2, 9)}`;
  }, [roomInfo?.roomId]);

  const endText =
    roomInfo?.role === "admin"
      ? {
          body: "Deleting this room ends it for everyone. You can always create a new one.",
          button: "End this room",
        }
      : {
          body: "You're about to leave this room. You can rejoin anytime.",
          button: "Leave this room",
        };

  const shareRoom = async () => {
    const roomId = roomInfo?.roomId;
    const url = `https://${location.hostname}/join/${roomId}`;
    const text = `Hey! I'm listening to some tunes in this music room: ${roomInfo?.title}. Join me and let's enjoy the music together.`;
    const shareData = {
      title: roomInfo?.title,
      text: text,
      url: url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
        } catch (error) {
          console.error("Error copying to clipboard:", error);
        }
      }
    }
    close("roomShare");
  };
  return (
    <>
      <div className="page hiddenScrollbar">
        <div className="stickyTop">
          <BackButton styleClass="ms-1 mt-2 ps-3" />
        </div>
        <p className="labelText mt-0 p-1 fs-1">{roomInfo?.title}</p>
        <div className="roomAccess p-1 mt-2">
          <span
            className={`borderBut p-0  ${members.length > 3 && "pe-3"}  ${
              members.length == 1 && "dp"
            }`}
          >
            <PlaylistOwner
              srcArray={members.map((item) => item.pic).slice(0, 3)}
              label={""}
              name=""
              totalOwner={members.length > 3 ? members.length : 0}
            />
          </span>
          <button className="borderBut" onClick={() => open("roomShare")}>
            Invite
          </button>
          {roomInfo?.role === "admin" ? (
            <button className="borderBut" onClick={() => open(endId)}>
              End
            </button>
          ) : (
            <button className="borderBut" onClick={() => open(endId)}>
              Leave
            </button>
          )}
        </div>
        <hr className="dividerLine" />
        <p className="labelText mt-0 p-1 ">Now playing</p>
        <div style={{ height: "100px" }}>
          {!Queue?.song ? (
            <div className="noSong">
              <p className="text-white-50">No active playback in the room.</p>
            </div>
          ) : (
            <div
              className="playlistSong m-auto mt-2"
              style={{ gridTemplateColumns: "50px auto 50px", width: "98%" }}
            >
              <img src={data.image} className="playlistSongImg rounded" />
              <div>
                <p className="thinOneLineText playlistSongTitle fw-normal">
                  {utils.refineText(data.title)}
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  {utils.refineText(data.subtitle)}
                </p>
              </div>

              <button className="iconButton">
                <img
                  src={
                    members.find(
                      (item) => item.clientId == currentSong?.clientId
                    )?.pic || defaultUser.pic
                  }
                  alt=""
                  className="playlistSongImg rounded-circle"
                  style={{ width: "30px", height: "30px" }}
                />
              </button>
            </div>
          )}
          {Queue?.status && playState && Queue?.status == "pause" && (
            <p
              className="text-center fst-italic mt-3 text-white-50 fw-light"
              style={{ fontSize: "14px" }}
            >
              Song paused by @
              {members.find((item) => item.clientId == playState.clientId)
                ?.username || defaultUser.username}
            </p>
          )}
        </div>
        <hr className="dividerLine" />
        <p className="labelText mt-0 p-1 ">Members activity</p>
        <div className="chatSection">
          {messages.length == 0 && (
            <div
              className="d-block text-center text-white-50 fw-light"
              style={{ marginTop: "50%" }}
            >
              <Emoji
                src={utils.stickerUrl("fish", "20")}
                imageStyleClass="m-auto w-50"
                loaderStyleClass="m-auto"
              />
              <p>Activity.</p>
            </div>
          )}
          {messages.map((item, index) => {
            if (item.type == "join") {
              return (
                <p
                  className="m-auto d-block text-center mt-3 mb-3 text-white-50 fw-light"
                  key={"join-msg-" + index}
                >
                  <i className="text-wheat">@{item?.username}</i> has joined the
                  room.
                </p>
              );
            }
            if (item.type == "leave") {
              return (
                <p
                  className="m-auto d-block text-center mt-3 mb-3 text-white-50 fw-light"
                  key={"left-msg-" + index}
                >
                  <i className="text-wheat">@{item?.username}</i> has left the
                  room.
                </p>
              );
            }
            if (item.type == "local-react") {
              return (
                <div
                  className="localReaction m-3 me-1"
                  key={"local-msg-" + index}
                >
                  <Emoji src={utils.stickerUrl(item.pack, item.id)} />
                  <img
                    src={
                      members.find((mem) => mem.clientId == item.clientId)
                        ?.pic || defaultUser.pic
                    }
                    className="reactProfile"
                    alt="profile pic"
                  />
                </div>
              );
            }
            if (item.type == "remote-react") {
              return (
                <div
                  className="remoteReaction m-3 ms-1"
                  key={"local-msg-" + index}
                >
                  <img
                    src={
                      members.find((mem) => mem.clientId == item.clientId)
                        ?.pic || defaultUser.pic
                    }
                    className="reactProfile"
                    alt="profile pic"
                  />
                  <Emoji src={utils.stickerUrl(item.pack, item.id)} />
                </div>
              );
            }
          })}
        </div>
      </div>
      {openElements.includes(endId) &&
        createPortal(
          <ConfirmPrompt
            id={endId}
            title="Are you sure?"
            body={endText.body}
            butText={endText.button}
            onConfirm={disconnect}
          />,
          document.body
        )}
      <OffCanvas
        open={openElements.includes("stickers")}
        dismiss={() => close("stickers")}
      >
        <Stickers />
      </OffCanvas>
      <OffCanvas
        open={openElements.includes("roomShare")}
        dismiss={() => close("roomShare")}
      >
        <p className="text-white text-center">
          Invite your friends to this music room.
        </p>
        <button
          className="addToBut addToButGrid mt-3 mb-3 px-4"
          onClick={() => shareRoom()}
        >
          <IosShareOutlined style={{ fontSize: "20px" }} />
          Share link
        </button>
        <hr className="dividerLine" />
        <div className="addToButGrid mt-4 mb-3 px-2">
          <div>
            <p className="text-white">Scan QR code</p>
            <p className="text-white-50">
              Let your friends scan this code to join room.
            </p>
          </div>
          <QrCode
            value={`https://${location.hostname}/join/${roomInfo?.roomId}`}
            fgColor="wheat"
            bgColor="#00000024"
          />
        </div>
      </OffCanvas>
    </>
  );
}
