import { useContext, useRef, useState } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

import {
  ArrowForwardIosOutlined,
  AutoDeleteOutlined,
  ExpandCircleDownOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { HashContext } from "./Hash";

export default function CreateHistory({ response, filter, filterData }) {
  const { open } = useContext(HashContext);
  const auth = useContext(AuthContext);
  const [accordian, showAccordian] = useState([]);
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
    /*  navigate(`/${type}/${id}`); */
  };
  const toggleAccordian = (id) => {
    const newAccordian = accordian.includes(id)
      ? accordian.filter((item) => item != id)
      : [...accordian, id];
    showAccordian(newAccordian);
  };
  const lastDate = useRef(false);
  const getLabel = (data) => {
    if (lastDate.current == false) {
      lastDate.current = data.updatedAt;
      return (
        <p className="labelText">{`${utils.formatTimestamp(
          data.updatedAt
        )}`}</p>
      );
    } else if (utils.isDifferentDay(lastDate.current, data.updatedAt)) {
      lastDate.current = data.updatedAt;
      return (
        <p className="labelText">{`${utils.formatTimestamp(
          data.updatedAt
        )}`}</p>
      );
    } else {
      lastDate.current = data.updatedAt;
      return;
    }
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
              <>
                {getLabel(item)}
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
                  {item.list.length > 0 && (
                    <button
                      className="iconButton svgBut"
                      onClick={() => toggleAccordian(item._id)}
                    >
                      {accordian.includes(item._id) ? (
                        <ExpandCircleDownOutlined
                          style={{ rotate: "180deg" }}
                        />
                      ) : (
                        <ExpandCircleDownOutlined />
                      )}
                    </button>
                  )}
                  {item.list.length == 0 && (
                    <button className="iconButton svgBut">
                      <ArrowForwardIosOutlined />
                    </button>
                  )}
                </div>
                {item.list.length > 0 && accordian.includes(item._id) && (
                  <div className="histSongCont">
                    {item.list.map((data) => {
                      return (
                        <div className="playlistSong" key={`hist_${data.id}`}>
                          <img
                            src={data.image}
                            alt={data.title}
                            className="playlistSongImg"
                            /* onClick={() => play(data.id)} */
                          />
                          <div className="extendedGrid">
                            <p
                              className="thinOneLineText playlistSongTitle"
                              /* onClick={() => play(data.id)} */
                              /* style={{ color: isPlaying ? "wheat" : "#ffffff" }} */
                            >
                              {utils.refineText(data.title)}
                            </p>
                            <p
                              className="thinOneLineText playlistSongSubTitle"
                              /* onClick={() => play(data.id)} */
                            >
                              {data.subtitle?.length != 0
                                ? utils.refineText(data.subtitle)
                                : utils.refineText(
                                    `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                                  )}
                            </p>
                          </div>

                          <div></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
