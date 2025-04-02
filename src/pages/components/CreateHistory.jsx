import { useContext } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

import { AutoDeleteOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { HashContext } from "./Hash";

export default function CreateHistory({ response, filter, filterData }) {
  const { open } = useContext(HashContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const getSubtitle = (item) => {
    let restText = "";
    if (item.activity == "played") {
      restText = `${item.list.length} songs played · ${utils.capitalLetter(
        item.type
      )}`;
    }
    if (item.activity == "saved") {
      restText = `${item.list.length} songs saved`;
      if (item.list.length == 0)
        restText = `Saved · ${utils.capitalLetter(item.type)}`;
    }
    return utils.refineText(`${restText}`);
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
            style={{ gridTemplateColumns: "40px auto  40px" }}
          >
            <img
              src={auth?.user?.pic || "logo.png"}
              className="rounded-circle"
            />
            <p className="labelText mt-0">Recents</p>

            <button className="iconButton">
              <AutoDeleteOutlined />
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
