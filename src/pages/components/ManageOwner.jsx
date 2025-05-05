import { PersonRemoveOutlined } from "@mui/icons-material";
import BackButton from "./BackButton";
import utils from "../../../utils";
import { useContext, useEffect, useState } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";

export default function ManageOwner({ ownerInfo, saveEdit, ownerId }) {
  const [localOwner, setLocalOwner] = useState(ownerInfo);
  const { openElements, close } = useContext(HashContext);
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
  const isDesktop = window.innerWidth >= 1000;
  if (isDesktop) {
    return (
      <OffCanvas
        open={openElements.includes(ownerId)}
        dismiss={() => close(ownerId)}
      >
        <div className="dlCont p-2" style={{ width: "300px" }}>
          <p className="text-white-50 fs-6">Manage collaborators</p>

          <div
            style={{ overflow: "scroll", maxHeight: "70dvh" }}
            className="hiddenScrollbar"
          >
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
            <hr className="dividerLine" />
            <button
              className="addToBut p-0 px-3 py-2"
              onClick={() => saveEdit({ invite: true })}
            >
              Invite new members
            </button>
            <p className="text-center text-secondary mt-2">
              Link expires in 7 days
            </p>
          </div>
        </div>
      </OffCanvas>
    );
  }
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
