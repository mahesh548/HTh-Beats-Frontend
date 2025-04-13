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

export default function Room() {
  const {
    members,
    roomInfo,
    channel,
    currentSong,
    playState,
    disconnect,
    defaultUser,
  } = useContext(channelContext);
  const { Queue } = useContext(songContext);
  const navigate = useNavigate();
  const { openElements, open, close } = useContext(HashContext);
  /* if (!channel) navigate("/home"); */
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

  return (
    <>
      <div className="page hiddenScrollbar">
        <BackButton styleClass="ms-1 mt-2 ps-3" />
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
          <button className="borderBut">Invite</button>
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
          <p className="m-auto d-block text-center mt-3 mb-3 text-white-50 fw-light">
            <i className="text-wheat">@username</i> has joined the room.
          </p>

          <div className="remoteReaction m-3 ms-1">
            <img src="logo.png" className="reactProfile" alt="profile pic" />
            <img
              src="https://tgs.sgp1.digitaloceanspaces.com/LovelyPeachy/flushed_27251a7d.gif"
              alt="reaction"
            />
          </div>
          <div className="remoteReaction m-3 ms-1">
            <img src="logo.png" className="reactProfile" alt="profile pic" />
            <img
              src="https://tgs.sgp1.digitaloceanspaces.com/LovelyPeachy/flushed_27251a7d.gif"
              alt="reaction"
            />
          </div>
          <div className="remoteReaction m-3 ms-1">
            <img src="logo.png" className="reactProfile" alt="profile pic" />
            <img
              src="https://tgs.sgp1.digitaloceanspaces.com/LovelyPeachy/flushed_27251a7d.gif"
              alt="reaction"
            />
          </div>

          <div className="localReaction m-3 me-1">
            <img
              src="https://tgs.sgp1.digitaloceanspaces.com/LovelyPeachy/flushed_27251a7d.gif"
              alt="reaction"
            />
            <img src="logo.png" className="reactProfile" alt="profile pic" />
          </div>
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
    </>
  );
}
