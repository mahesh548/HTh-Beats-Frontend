import { PersonRemoveOutlined } from "@mui/icons-material";
import BackButton from "./BackButton";
import utils from "../../../utils";
import { useEffect, useState } from "react";

export default function ManageOwner({ ownerInfo, saveEdit }) {
  const [localOwner, setLocalOwner] = useState(ownerInfo);
  useEffect(() => {
    setLocalOwner(ownerInfo);
  }, [ownerInfo]);

  const removeThis = (id) => {
    setLocalOwner((prev) => {
      saveEdit({
        members: prev.map((item) => item.id).filter((item) => item != id),
      });
      return prev.filter((item) => item.id != id);
    });
  };
  return (
    <div className="floatingPage">
      <div className="editCont hiddenScrollbar">
        <div className="navbarAddTo editNav">
          <BackButton />
          <p>Manage collaborators</p>
        </div>
        <div style={{ marginTop: "50px" }}>
          {localOwner.map((item) => {
            return (
              <div
                className="playlistSong"
                style={{
                  width: "95%",
                  margin: "30px auto",
                }}
                key={`${item.username}_members`}
              >
                <img
                  src={item.pic}
                  className="playlistSongImg m-auto rounded"
                  style={{ height: "40px", width: "40px" }}
                />
                <div>
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.username)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {`Playlist's ${item.role}`}
                  </p>
                </div>
                <div></div>
                {item.role == "member" && (
                  <button
                    className="iconButton"
                    onClick={() => removeThis(item.id)}
                  >
                    <PersonRemoveOutlined style={{ color: "#c1c1c1" }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <button
            className="addToBut"
            onClick={() => saveEdit({ invite: true })}
          >
            Invite new members
          </button>
          <p className="text-center text-secondary mt-2">
            Link expires in 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
