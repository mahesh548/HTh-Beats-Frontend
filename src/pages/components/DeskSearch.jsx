import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { HashContext } from "./Hash";
import CreateRadio from "./CreateRadio";
import { ArrowBack, Close } from "@mui/icons-material";
import utils from "../../../utils";
import PageLoader from "./PageLoader";
import SearchCard from "./SearchCard";
import ChipSort from "./ChipSort";

import { useInView } from "react-intersection-observer";
import { Link, useLocation, useNavigate } from "react-router";

import TimelineSlider from "./TimelineSlider";

const idealFilterData = [
  { value: "playlist", parent: "all", label: "Playlists" },
  { value: "song", parent: "all", label: "Songs" },
  { value: "album", parent: "all", label: "Albums" },
  { value: "mix", parent: "all", label: "Mixes" },
  { value: "artist", parent: "all", label: "Artists" },
  { value: "saved", parent: "all", label: "Saved" },
];

export default function DeskSearch() {
  // const auth = useContext(AuthContext);
  const { openElements, open, close } = useContext(HashContext);
  // const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const [view, setView] = useState("explore");
  // const [acResult, setAcResult] = useState();
  const [searchResult, setSearchResult] = useState([]);

  const [originalResponse, setOriginalResponse] = useState({ page: 1 });
  const callAgain = useRef(false);
  const filterActive = useRef(false);
  const location = useLocation();
  const prevQ = useRef("");

  const discover = localStorage?.homeCache
    ? JSON.parse(localStorage.homeCache).radio
    : false;

  const search = async (query, page = 1, loading = true) => {
    if (loading) {
      setView("loading"); // show loading only if page no 1
    }

    // make api req
    const response = await utils.API(
      `/search?q=${query}&autocomplete=false&page=${page}`
    );
    if (response.status && response.data && response.page == 1) {
      setSearchResult(sortResponse(response.data, query)); // set search result after sort
      setupOriginal(response, query); // set original response for sorting
      setView("search"); // set view to search
      callAgain.current = response.hasMore; // set call again to hasMore (true,false) for more result
    } else if (response.status && response.data && response.page > 1) {
      // if page no is not 1 don't show loading and merge data
      const newData = [
        ...new Map(
          [...response.data, ...searchResult].map((item) => [item.id, item])
        ).values(),
      ];
      setSearchResult(sortResponse(newData, query)); // set result after merging with old
      response.data = sortResponse(newData, query);
      setupOriginal(response, query); // set original data for sorting after merging

      callAgain.current = response.hasMore; // set call again to hasMore (true,false) for more result
    }
  };

  const setupOriginal = (response, query) => {
    // add filter data to show sort chip
    let newFilterData = [];
    idealFilterData.forEach((item) => {
      if (item.value == "saved") {
        if (
          response.data.some(
            (response) => response?.savedIn?.length > 0 || response?.isLiked
          )
        )
          newFilterData.push(item);
        return;
      }
      if (response.data.some((response) => response.type == item.value)) {
        newFilterData.push(item);
      }
    });

    //set originalResponse state
    setOriginalResponse({
      data: response.data,
      query: query,
      filterData: newFilterData,
      hasMore: response.hasMore,
      page: response.page,
    });
  };

  const filter = (value) => {
    // sort chip fiter function
    if (value == "all") {
      filterActive.current = false;
      setSearchResult(
        sortResponse(originalResponse.data, originalResponse.query)
      );
    } else if (value == "saved") {
      filterActive.current = true;
      setSearchResult(
        sortResponse(originalResponse.data, originalResponse.query).filter(
          (item) => item?.savedIn?.length > 0 || item?.isLiked
        )
      );
    } else {
      filterActive.current = true;
      setSearchResult(
        sortResponse(originalResponse.data, originalResponse.query).filter(
          (item) => item.type == value
        )
      );
    }
  };

  const sortResponse = (data, query) => {
    // sort response in way that most matched title come first then least and then most matched subtitle.
    return data
      .map((item) => {
        const title = item?.title || item?.name;
        const subtitle = item?.subtitle || "";
        const titleIndex = title.toLowerCase().indexOf(query.toLowerCase());
        const subTitleIndex = subtitle
          .toLowerCase()
          .indexOf(query.toLowerCase());

        return {
          ...item,
          titleMatch: titleIndex !== -1 ? 1 : 0,
          subtitleMatch: subTitleIndex !== -1 ? 1 : 0,
          titleScore: titleIndex === -1 ? Infinity : titleIndex,
          subtitleScore: subTitleIndex === -1 ? Infinity : subTitleIndex,
        };
      })
      .sort((a, b) => {
        if (b.titleMatch !== a.titleMatch) return b.titleMatch - a.titleMatch;
        if (a.titleScore !== b.titleScore) return a.titleScore - b.titleScore;
        if (b.subtitleMatch !== a.subtitleMatch)
          return b.subtitleMatch - a.subtitleMatch;
        return a.subtitleScore - b.subtitleScore;
      });
  };

  const handleLocalLike = (obj, id) => {
    // to show like and unlike
    const { savedTo, removedFrom } = obj;
    if (savedTo.length == 0 && removedFrom.length == 0) return;
    let newList = searchResult.map((item) => {
      if (item.id != id) return item;
      item.savedIn = [...new Set([...item.savedIn, ...savedTo])].filter(
        (item2) => !removedFrom.includes(item2)
      );
      return item;
    });
    setSearchResult(newList);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    if (query && query.length > 0) {
      if (prevQ.current === query) return;
      prevQ.current = query;
      search(query);
    } else {
      prevQ.current = "";
      setView("explore");
    }
  }, [location.search]);

  const songResult = searchResult
    .filter((item) => item.type == "song")
    .map((item) => {
      if (item?.url && !item.perma_url) item.perma_url = item.url;
      if (item?.name && !item.title) item.title = item.name;
      return item;
    });
  const playlistResult = searchResult
    .filter((item) => item.type == "playlist")
    .map((item) => {
      if (item?.url && !item.perma_url) item.perma_url = item.url;
      if (item?.name && !item.title) item.title = item.name;
      return item;
    });
  const artistResult = searchResult
    .filter((item) => item.type == "artist")
    .map((item) => {
      if (item?.url && !item.perma_url) item.perma_url = item.url;
      if (item?.name && !item.title) item.title = item.name;
      return item;
    });
  const albumResult = searchResult
    .filter((item) => item.type == "album")
    .map((item) => {
      if (item?.url && !item.perma_url) item.perma_url = item.url;
      if (item?.name && !item.title) item.title = item.name;
      return item;
    });

  if (document.getElementById("audio")) {
    if (!document.getElementById("audio").paused) {
      utils.editMeta("", "#000000");
    } else {
      utils.editMeta(`HTh Beats - Search`, "#000000");
    }
  }

  return (
    <div
      className="page hiddenScrollbar position-relative"
      id="searchPage"
      style={{ overflowY: "scroll" }}
    >
      {discover && view !== "search" && (
        <>
          <p className="labelText px-1 dp-s">Browse all</p>
          <div className="browseCont mt-3 px-1">
            {discover.map((item) => {
              return <CreateRadio data={item} key={`discover_${item.id}`} />;
            })}
          </div>
        </>
      )}
      <div
        className="searchCont hiddenScrollbar"
        style={{ display: openElements.includes("search") ? "block" : "none" }}
      >
        {view === "search" && (
          <div className="srchSort hiddenScrollbar dp-s">
            <ChipSort
              filterData={originalResponse?.filterData || []}
              filter={filter}
              styleClass="srchSortChip "
            />
          </div>
        )}
        <div className="searchMain hiddenScrollbar">
          {view === "loading" && <PageLoader />}

          {view === "search" && (
            <div
              className="overflow-scroll px-2 pt-4 hiddenScrollbar deskScroll"
              style={{ paddingBottom: "150px" }}
            >
              <div className="d-flex dp-s" style={{ gap: "20px" }}>
                <div className="w-100 srchSong">
                  {songResult.length > 0 && (
                    <p className="labelText ps-2">Songs</p>
                  )}
                  {songResult.map((item) => (
                    <SearchCard
                      data={item}
                      ac={false}
                      key={item.id}
                      setGlobalLike={handleLocalLike}
                    />
                  ))}
                </div>
                <div className="w-50">
                  {!filterActive.current && (
                    <>
                      <p className="labelText">Top result</p>
                      <div
                        className="topResult"
                        onClick={() =>
                          navigate(
                            `/${searchResult[0]?.type}/${
                              searchResult[0]?.perma_url || searchResult[0]?.url
                            }`
                          )
                        }
                      >
                        <img
                          src={searchResult[0]?.image
                            .replace("150x150", "500x500")
                            .replace("50x50", "500x500")}
                        />
                        <div className="topResultText">
                          <p className="thinOneLineText playlistSongTitle">
                            {searchResult[0]?.title || searchResult[0]?.name}
                          </p>
                          <p className="thinOneLineText playlistSongSubTitle">
                            {`${searchResult[0]?.type} ${
                              searchResult[0]?.subtitle
                                ? " · " + searchResult[0]?.subtitle
                                : ""
                            }`}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {playlistResult.length > 0 && (
                <TimelineSlider label="Playlists" data={playlistResult} />
              )}
              {artistResult.length > 0 && (
                <TimelineSlider
                  label="Artists"
                  data={artistResult}
                  style="round"
                />
              )}
              {albumResult.length > 0 && (
                <TimelineSlider label="Albums" data={albumResult} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
