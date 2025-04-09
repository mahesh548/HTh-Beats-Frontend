import { useContext, useState } from "react";
import { HashContext } from "./Hash";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import { channelContext } from "./Channel";
import PageLoader from "./PageLoader";
import { useNavigate } from "react-router";

export default function MakeRoom() {
  const auth = useContext(AuthContext);
  const room = useContext(channelContext);
  const { close } = useContext(HashContext);
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
        await room.connect({ ...response.data });
        navigate("/room");
      }
    }
  };
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
