import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";

import PlaylistNotFound from "./components/PlaylistNotFound";
import { channelContext } from "./components/Channel";
import { songContext } from "./components/Song";

export default function Join() {
  const auth = useContext(AuthContext);
  const room = useContext(channelContext);
  const { setQueue } = useContext(songContext);
  const { id } = useParams();
  const [roomInfo, setRoomInfo] = useState(false);
  const navigate = useNavigate();

  if (!id) {
    //send to /home if id not provided
    navigate("/home");
  }

  const connectRoom = async (data) => {
    setRoomInfo(false);
    await setQueue({ type: "RESET" });
    const audio = document.getElementById("audio");
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";

    delete data.adminData;
    const { success } = await room.connect({ ...data });

    if (success) {
      navigate(`/room`);
    } else {
      setRoomInfo("unavailable");
    }
  };

  const getRoom = async () => {
    const roomData = {
      inviteCode: id,
    };
    const response = await utils.BACKEND("/room/join", "POST", {
      roomData: roomData,
    });

    if (response.status && response.found) {
      setRoomInfo({ ...response.data });
    } else {
      //if room not found set roomInfo to unavailable
      setRoomInfo("unavailable");
    }
  };

  useEffect(() => {
    if (auth.user?.verified) {
      getRoom();
    }
  }, [auth.user, id]);

  const CreateRoom = ({ data }) => {
    utils.editMeta(`Join - ${data?.title}`, "#f5deb37d");
    return (
      <div className="page hiddenScrollbar">
        <div
          className="backgroundGradient position-absolute"
          style={{ backgroundColor: "#f5deb37d" }}
        ></div>
        <div className="editCont hiddenScrollbar">
          <div className="mt-5">
            <img
              src={data.adminData.pic}
              style={{ height: "150px", width: "150px" }}
              className="d-block m-auto rounded-circle"
            />
            <p className="labelText text-center">{data.title}</p>
          </div>
          <div className="mt-4">
            <p className="text-center text-white-50">
              You are invited to join this room created by{" "}
              {data.adminData.username}.
            </p>
            <button className="addToBut mt-4" onClick={() => connectRoom(data)}>
              Join music room
            </button>
          </div>
        </div>
      </div>
    );
  };

  return roomInfo == false ? (
    <PageLoader />
  ) : roomInfo === "unavailable" ? (
    <PlaylistNotFound />
  ) : (
    <CreateRoom data={roomInfo} />
  );
}
