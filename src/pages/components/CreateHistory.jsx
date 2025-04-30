import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import utils from "../../../utils";
import { AuthContext } from "./Auth";
import ChipSort from "./ChipSort";

import {
  ArrowForwardIosOutlined,
  AutoDeleteOutlined,
  CheckBox,
  CheckBoxOutlineBlank,
  ExpandCircleDownOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { HashContext } from "./Hash";
import PageLoader from "./PageLoader";

import { useInView } from "react-intersection-observer";
import { createPortal } from "react-dom";
import ConfirmPrompt from "./ConfirmPrompt";
import { showToast } from "./showToast";

export default function CreateHistory({
  response,
  filter,
  filterData,
  next,
  hasMore,
  filterActive,
}) {
  const { openElements, open, close } = useContext(HashContext);
  const auth = useContext(AuthContext);
  const [accordian, showAccordian] = useState([]);
  const navigate = useNavigate();
  const [deleteList, setDeleteList] = useState([]);

  const getSubtitle = (item) => {
    let restText = "";
    const username = auth?.user?.username;
    if (item.activity == "played" && item.type == "song") {
      return "";
    }
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
    if (item.activity == "created") {
      restText = `Created · Playlist · ${username}`;
    }
    if (item.activity == "joined") {
      restText = `Joined · Collab`;
    }
    return utils.refineText(`${restText}`);
  };

  const delId = useMemo(() => {
    return `del_${Math.random().toString(36).substr(2, 9)}`;
  }, [response]);

  const handleClick = (type, id) => {
    if (item.activity == "played" && type == "song") return;
    if (type == "search") return;
    navigate(`/${type}/${id}`);
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
  const [moreRef, askMore, entry] = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (!askMore) return;
    next();
  }, [askMore]);

  const toggleDelete = (id) => {
    if (deleteList.includes(id)) {
      setDeleteList(deleteList.filter((item) => item != id));
    } else {
      setDeleteList([...deleteList, id]);
    }
  };

  const deleteAll = () => {
    setDeleteList(response.map((item) => item._id));
  };

  const deleteHistory = async () => {
    close("deleteHist");
    const response = await utils.BACKEND(`/activity`, "DELETE", {
      deleteData: { historyIds: deleteList, type: "history" },
    });
    if (response.status && response?.delete) {
      showToast({ text: "History deleted" });
      setDeleteList([]);
      next(true);
    }
  };
  if (response.length == 0) {
    return <p>You don't have any history</p>;
  }

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont ">
        <div className="libraryNavCont px-2" style={{ zIndex: "11" }}>
          <div
            className="libraryNav mt-4 mb-3"
            style={{ gridTemplateColumns: "40px auto  max-content" }}
          >
            <Link to="/profile">
              <img
                src={auth?.user?.pic || "logo.png"}
                className="rounded-circle"
              />
            </Link>

            <p className="labelText mt-0">Recents</p>

            {openElements.includes("deleteHist") ? (
              deleteList.length == 0 ? (
                <button
                  className="iconButton text-primary"
                  onClick={() => deleteAll()}
                >
                  Select all
                </button>
              ) : (
                <button
                  className="iconButton text-danger"
                  onClick={() => open(delId)}
                >
                  Delete
                </button>
              )
            ) : (
              <button
                className="iconButton"
                onClick={() => {
                  showAccordian([]);
                  open("deleteHist");
                }}
              >
                <AutoDeleteOutlined />
              </button>
            )}
          </div>
          <ChipSort filterData={filterData} filter={filter} />
        </div>

        <div className="libraryList px-2">
          {response.map((item) => {
            return (
              <React.Fragment key={`history-list-${item?._id}`}>
                {getLabel(item)}
                <div
                  className={`playlistSong ${
                    openElements.includes("deleteHist")
                      ? "deleteList"
                      : "libraryList"
                  } `}
                  onClick={() => handleClick(item.type, item?.perma_url)}
                >
                  {openElements.includes("deleteHist") && (
                    <button
                      className="iconButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDelete(item._id);
                      }}
                    >
                      {deleteList.includes(item._id) ? (
                        <CheckBox className="text-primary" />
                      ) : (
                        <CheckBoxOutlineBlank />
                      )}
                    </button>
                  )}
                  <div
                    className={` ${
                      item.type == "song" &&
                      item.activity == "played" &&
                      item.list.length > 1
                        ? "multipleShadow"
                        : ""
                    }`}
                  >
                    <img
                      src={item.image}
                      className="playlistSongImg rounded"
                      style={{
                        borderRadius: item.type == "artist" ? "100%" : "0px",
                      }}
                    />
                  </div>

                  <div>
                    <p className="thinOneLineText playlistSongTitle">
                      {utils.refineText(item.title || item.name)}
                    </p>
                    <p className="thinOneLineText playlistSongSubTitle">
                      {getSubtitle(item)}
                    </p>
                  </div>
                  {item.list.length > 0 &&
                    !openElements.includes("deleteHist") && (
                      <button
                        className="iconButton svgBut"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccordian(item._id);
                        }}
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
                  {item.list.length == 0 &&
                    !openElements.includes("deleteHist") && (
                      <button className="iconButton svgBut">
                        <ArrowForwardIosOutlined />
                      </button>
                    )}
                </div>
                {item.list.length > 0 && accordian.includes(item._id) && (
                  <div className="histSongCont">
                    {item.list.map((data) => {
                      return (
                        <div
                          className="playlistSong"
                          key={`song_hist_${data.id}`}
                        >
                          <img
                            src={data.image}
                            alt={data.title}
                            className="playlistSongImg"
                            onClick={() => handleClick("song", data.perma_url)}
                          />
                          <div className="extendedGrid">
                            <p
                              className="thinOneLineText playlistSongTitle"
                              onClick={() =>
                                handleClick("song", data.perma_url)
                              }
                            >
                              {utils.refineText(data.title)}
                            </p>
                            <p
                              className="thinOneLineText playlistSongSubTitle"
                              onClick={() =>
                                handleClick("song", data.perma_url)
                              }
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
              </React.Fragment>
            );
          })}
        </div>
        {hasMore && !filterActive && !openElements.includes("deleteHist") && (
          <div ref={moreRef}>
            <PageLoader />
          </div>
        )}

        {openElements.includes(delId) &&
          createPortal(
            <ConfirmPrompt
              id={delId}
              title="Are you sure?"
              body={
                "Once deleted, you will not be able to recover this history."
              }
              butText={"Delete"}
              onConfirm={deleteHistory}
            />,
            document.body
          )}
      </div>
    </div>
  );
}
