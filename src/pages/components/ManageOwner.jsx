import {
  Cancel,
  CancelOutlined,
  Close,
  PersonRemove,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import BackButton from "./BackButton";
import utils from "../../../utils";

export default function ManageOwner({ ownerId, ownerInfo }) {
  return (
    <div className="floatingPage">
      <div className="editCont hiddenScrollbar">
        <div className="navbarAddTo editNav">
          <BackButton />
          <p>Manage collaborators</p>
        </div>
        <div style={{ marginTop: "50px" }}>
          {ownerInfo.map((item) => {
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
                  <button className="iconButton">
                    <PersonRemoveOutlined style={{ color: "#c1c1c1" }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
