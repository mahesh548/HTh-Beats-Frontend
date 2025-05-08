import { useContext, useState } from "react";
import { HashContext } from "./Hash";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import { channelContext } from "./Channel";
import PageLoader from "./PageLoader";
import { useNavigate } from "react-router";
import { songContext } from "./Song";
import { showToast } from "./showToast";

export default function MakeRoom() {
  const auth = useContext(AuthContext);
  const room = useContext(channelContext);
  const { close } = useContext(HashContext);
  const { setQueue } = useContext(songContext);
  const [RoomName, setRoomName] = useState(`${auth?.user?.username}'s Room`);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (RoomName.length > 0) {
      setLoading(true);
      const response = await utils.BACKEND("/room/create", "POST", {
        roomData: {
          title: RoomName,
        },
      });

      if (response.status) {
        showToast({ text: "Music room is ready" });
        await setQueue({ type: "RESET" });
        const audio = document.getElementById("audio");
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";

        await room.connect({ ...response.data });
        navigate("/room");
      }
    }
  };
  const isDesktop = window.innerWidth >= 1000;
  if (isDesktop) {
    return (
      <>
        {loading ? (
          <PageLoader />
        ) : (
          <div className="deskBack contextMenuPart" onClick={() => goBack()}>
            <div
              className="deskEditCont "
              onClick={(e) => e.stopPropagation()}
              style={{ width: "350px" }}
            >
              <p className="labelText text-start">Choose name for room</p>
              <hr className="dividerLine" />
              {/* <input
                  type="text"
                  value={RoomName}
                  className="iconButton mpInput"
                  onInput={(e) => setRoomName(e.target.value)}
                  id="roomName"
                /> */}
              <input
                type="text"
                value={RoomName}
                className=" edInput m-auto mt-2 mb-2"
                onInput={(e) => {
                  setRoomName(e.target.value);
                }}
                id="playlistName"
              />
              <hr className="dividerLine" />
              <div className="text-end">
                <button
                  className="iconButton d-inline"
                  onClick={() => close("createRoom")}
                >
                  Cancel
                </button>
                <button
                  className={`addToBut me-1 px-3 py-2 d-inline ms-3 mt-1 opacity-100 cursor-pointer `}
                  onClick={() => handleCreate()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <div
      className="floatingPage"
      style={{
        backgroundImage: `${
          loading ? "black" : "linear-gradient(179deg, #f5deb37d, transparent)"
        }`,
      }}
    >
      {loading ? (
        <PageLoader />
      ) : (
        <div className="makePCont ">
          <p className="labelText">Choose name for room</p>
          <input
            type="text"
            value={RoomName}
            className="iconButton mpInput"
            onInput={(e) => setRoomName(e.target.value)}
            id="roomName"
          />
          <div>
            <button
              className="addToBut mpBut px-5"
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid gray",
              }}
              onClick={() => close("createRoom")}
            >
              Cancel
            </button>
            <button
              className="addToBut mpBut px-5"
              onClick={() => handleCreate()}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
