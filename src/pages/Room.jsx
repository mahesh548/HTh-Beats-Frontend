import { useContext, useMemo } from "react";
import BackButton from "./components/BackButton";
import PlaylistOwner from "./components/PlaylistOwner";
import { channelContext } from "./components/Channel";
import { useNavigate } from "react-router";
import utils from "../../utils";
import { songContext } from "./components/Song";

export default function Room() {
  const { members, roomInfo, channel, currentSong } =
    useContext(channelContext);
  const { Queue } = useContext(songContext);
  const navigate = useNavigate();
  /* if (!channel) navigate("/home"); */
  const data = useMemo(() => {
    if (Queue.song && Queue.playlist) {
      return utils.getItemFromId(Queue?.song, Queue?.playlist?.list);
    }
  }, [Queue?.song, Queue?.playlist]);

  return (
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
          <button className="borderBut">End</button>
        ) : (
          <button className="borderBut">Leave</button>
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
                  members.find((item) => item.clientId == currentSong?.clientId)
                    ?.pic
                }
                alt=""
                className="playlistSongImg rounded-circle"
                style={{ width: "30px", height: "30px" }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
