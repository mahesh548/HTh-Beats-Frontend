import { useContext } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

//icons
import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { Add } from "@mui/icons-material";

export default function CreateLibrary({ response, filter, filterData }) {
  const auth = useContext(AuthContext);
  const getSubtitle = (item) => {
    let restText = "";
    const username = auth?.user?.username;
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
      restText = ` · ${username}`;
    }
    if (item.libraryType == "collab") {
      restText = ` · ${item.libraryUserId.length} users collab`;
    }

    return utils.refineText(`${utils.capitalLetter(item.type)} ${restText}`);
  };
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont ">
        <div className="libraryNavCont">
          <div className="libraryNav px-2 mt-3 mb-3">
            <img
              src={auth?.user?.pic || "logo.png"}
              className="rounded-circle"
            />
            <p className="labelText mt-0">Your library</p>
            <button className="iconButton">
              <img src={searchSvgOutlined} />
            </button>
            <button className="iconButton">
              <Add />
            </button>
          </div>
          <ChipSort filterData={filterData} filter={filter} />
        </div>
        <div className="libraryList px-2">
          {response.map((item) => {
            return (
              <div
                className="playlistSong libraryList"
                key={`liked-list-${item.id}`}
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
