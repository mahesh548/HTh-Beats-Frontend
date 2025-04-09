import { useContext } from "react";
import BackButton from "./components/BackButton";
import PlaylistOwner from "./components/PlaylistOwner";
import { channelContext } from "./components/Channel";
import { useNavigate } from "react-router";

export default function Room() {
  const { members, roomInfo, channel } = useContext(channelContext);
  const navigate = useNavigate();
  /* if (!channel) navigate("/home"); */
  console.log(members.length);
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
    </div>
  );
}
