import { useContext } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

import {
  Add,
  AddBoxOutlined,
  ArrowForwardIos,
  ArrowForwardIosOutlined,
  History,
} from "@mui/icons-material";
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

  if (document.getElementById("audio")) {
    if (!document.getElementById("audio").paused) {
      utils.editMeta("", "#000000");
    } else {
      utils.editMeta(`HTh Beats - Library`, "#000000");
    }
  }

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont desk-libraryCont">
        <div className="libraryNavCont px-2 desk-libraryNavCont">
          <div
            className="libraryNav mt-4 mb-3 mobo"
            style={{ gridTemplateColumns: "40px auto 40px 40px" }}
          >
            <Link to="/profile">
              <img
                src={
                  auth?.user?.pic ||
                  "https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png"
                }
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
          <div className="desk">
            <p className="labelText mt-0 desk mb-2 d-inline-block">
              Your library
            </p>
            <button
              className="addToBut m-0 d-inline-block float-end px-3 py-1 text-white me-2"
              style={{ backgroundColor: "#ffffff30" }}
              onClick={() => open("createOption")}
            >
              <Add className="text-white-50" />
              Create
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
