import { useContext } from "react";
import BackButton from "./components/BackButton";
import PlaylistOwner from "./components/PlaylistOwner";
import { channelContext } from "./components/Channel";

export default function Room() {
  const { members } = useContext(channelContext);
  return (
    <div className="page hiddenScrollbar">
      <BackButton styleClass="ms-1 mt-2 ps-3" />
      <p className="labelText mt-0 p-1">Mahesh's room</p>
      <div className="roomAccess p-1 mt-2">
        <button
          className={`borderBut p-0 pe-2 ${members.length <= 3 ? "ps-2" : ""}`}
        >
          <PlaylistOwner
            srcArray={members.map((item) => item.pic).slice(0, 3)}
            label={""}
            name=""
            totalOwner={members.length > 3 ? members.length - 3 : 0}
          />
        </button>
        <button className="borderBut">Invite</button>
        <button className="borderBut">Leave</button>
      </div>
      <hr className="dividerLine" />
    </div>
  );
}
