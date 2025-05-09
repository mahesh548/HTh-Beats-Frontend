import { useContext } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

import { Add, History } from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { HashContext } from "./Hash";

export default function CreateLibrary({ response, filter, filterData }) {
  const { open } = useContext(HashContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const getSubtitle = (item) => {
    let restText = "";
    const username = auth?.user?.username;
    const myUserId = auth?.user?.id;
    if (item.type == "playlist") {
      restText = ` · HTh-Beats`;
    }
    if (
      item.type == "album" ||
      item.type == "mix" ||
      item.libraryType == "liked"
    ) {
      restText = ` · ${item.list_count} songs`;
    }
    if (item.libraryType == "private") {
      restText = ` · ${item.userId.includes(myUserId) ? username : "Public"}`;
    }
    if (item.libraryType == "collab") {
      restText = ` · ${
        item.libraryUserId.filter((item) => item != "viewOnly").length
      } users collab`;
    }

    return utils.refineText(`${utils.capitalLetter(item.type)} ${restText}`);
  };
  const handleClick = (type, id) => {
    navigate(`/${type}/${id}`);
  };
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont ">
        <div className="libraryNavCont px-2">
          <div
            className="libraryNav mt-4 mb-3"
            style={{ gridTemplateColumns: "40px auto 40px 40px" }}
          >
            <Link to="/profile">
              <img
                src={auth?.user?.pic || "logo.png"}
                className="rounded-circle"
              />
            </Link>

            <p className="labelText mt-0">Your library</p>

            <button className="iconButton" onClick={() => open("createOption")}>
              <Add />
            </button>
            <button className="iconButton" onClick={() => navigate("/history")}>
              <History />
            </button>
          </div>
          <ChipSort filterData={filterData} filter={filter} />
        </div>
        <div className="libraryList px-2">
          {response.map((item) => {
            return (
              <div
                className="playlistSong libraryList"
                key={`liked-list-${item?.id || item?.artistId}`}
                onClick={() => handleClick(item.type, item?.perma_url)}
              >
                <img
                  src={item.image}
                  className="playlistSongImg"
                  style={{
                    borderRadius: item.type == "artist" ? "100%" : "0px",
                  }}
                />
                <div>
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.title || item.name)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {getSubtitle(item)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
