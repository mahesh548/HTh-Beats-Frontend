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
import { useLocation, useNavigate } from "react-router";
import SearchHistCard from "./SearchHistCard";

const idealFilterData = [
  { value: "playlist", parent: "all", label: "Playlists" },
  { value: "song", parent: "all", label: "Songs" },
  { value: "album", parent: "all", label: "Albums" },
  { value: "mix", parent: "all", label: "Mixes" },
  { value: "artist", parent: "all", label: "Artists" },
  { value: "saved", parent: "all", label: "Saved" },
];

export default function CreateSearch() {
  const auth = useContext(AuthContext);
  const { openElements, open, close } = useContext(HashContext);
  const [searchInput, setSearchInput] = useState("");
  const [view, setView] = useState(
    localStorage.searched && JSON.parse(localStorage.searched).length > 0
      ? "history"
      : "default"
  );
  const [acResult, setAcResult] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [historyResult, setHistoryResult] = useState(
    JSON.parse(localStorage?.searched || "[]")
  );
  const [originalResponse, setOriginalResponse] = useState({ page: 1 });
  const callAgain = useRef(false);
  const filterActive = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const discover = localStorage?.homeCache
    ? JSON.parse(localStorage.homeCache).radio
    : false;

  //to store time difference between key stroke and search
  let searchTimeOut = useRef(null);

  //for infinite scrolling
  const [moreRef, askMore, entry] = useInView({
    threshold: 1,
  });

  useEffect(() => {
    // clear old timeout
    clearTimeout(searchTimeOut.current);
    if (searchInput.length === 0) {
      // show history if nothing searched
      setView(localStorage.searched ? "history" : "default");
      return;
    }

    //set new timeout for new stroke
    searchTimeOut.current = setTimeout(() => {
      autoComplete(searchInput);
    }, 1000);
  }, [searchInput]);

  const autoComplete = async (query) => {
    setView("loading"); //show loading
    const response = await utils.API(`/search?q=${query}&autocomplete=true`);
    if (response.status && response.data) {
      setAcResult(sortResponse(response.data, query)); // set autocomplete data
      setView("autocomplete"); // set view to autocomplete
    }
  };

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

  const processInput = (value) => {
    setSearchInput(value);
    if (value.length === 0)
      setView(localStorage.searched ? "history" : "default");
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
    // if loading more is in sight call api with page+1
    if (!askMore || !callAgain.current) return;
    callAgain.current = false;

    search(originalResponse.query, originalResponse.page + 1, false);
  }, [askMore]);

  const updateUrl = (value) => {
    // save search input into url
    const param = new URLSearchParams(location.search);

    if (value.length === 0) {
      param.delete("q");
    } else {
      param.set("q", value);
    }

    navigate(`${location.pathname}?${param.toString()}`, { replace: true });
  };

  useEffect(() => {
    // if query updated in url then search for query
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query && query.length > 0) {
      search(query);
    }
  }, [location.search]);

  useEffect(() => {
    setView(historyResult.length > 0 ? "history" : "default");
  }, [historyResult]);

  const removeFromHistory = async (songId, historyId) => {
    const oldHistory = JSON.parse(localStorage?.searched);
    if (oldHistory.length == 0) return;
    if (songId.includes("all")) {
      localStorage.setItem("searched", "[]");
      setHistoryResult([]);

      await utils.BACKEND(`/activity`, "DELETE", {
        deleteData: { historyIds: ["all"], type: "search", idList: ["all"] },
      });
      return;
    }
    const newHistory = oldHistory.filter(
      (item) => item.id != songId && item.historyId != historyId
    );
    localStorage.setItem("searched", JSON.stringify(newHistory));
    setHistoryResult(newHistory);

    await utils.BACKEND(`/activity`, "DELETE", {
      deleteData: { historyIds: historyId, type: "search", idList: songId },
    });
  };

  return (
    <div
      className="page hiddenScrollbar"
      id="searchPage"
      style={{ overflowY: "scroll" }}
    >
      <div className="libraryNavCont px-2 position-relative">
        <div className="libraryNav mt-4 mb-3">
          <img src={auth?.user?.pic || "logo.png"} className="rounded-circle" />
          <p className="labelText mt-0">Search</p>
        </div>
      </div>
      <button className="srchOpenBut" onClick={() => open("search")}>
        <img src={searchSvgOutlined} />
        <p className="text-start">Hey, what do you want to listen?</p>
      </button>
      {discover && (
        <>
          <p className="labelText px-1">Browse all</p>
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
        <div className="srchBox pe-3">
          <button className="iconButton" onClick={() => close("search")}>
            <ArrowBack />
          </button>
          <input
            type="search"
            placeholder="Hey, what do you want to listen?"
            className="srchInput"
            value={searchInput}
            onInput={(e) => processInput(e.target.value)}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateUrl(e.target.value);
              }
            }}
          />
          {searchInput.length > 0 && (
            <button className="iconButton" onClick={() => setSearchInput("")}>
              <Close />
            </button>
          )}
        </div>
        {view === "search" && (
          <div className="srchSort hiddenScrollbar">
            <ChipSort
              filterData={originalResponse?.filterData || []}
              filter={filter}
              styleClass="srchSortChip"
            />
          </div>
        )}
        <div className="searchMain hiddenScrollbar">
          {view === "default" && (
            <div className="defaultCont">
              <p className="text-white fs-5">Search what you like</p>
              <p className="text-white-50 fs-6">
                Search for artists, songs, playlists, and more.
              </p>
            </div>
          )}
          {view === "loading" && <PageLoader />}
          {view === "history" && historyResult.length > 0 && (
            <>
              <p className="labelText ps-2">Recent searches</p>
              <div className="px-2" style={{ paddingBottom: "150px" }}>
                {historyResult.map((item, index) => {
                  return (
                    <SearchHistCard
                      data={item}
                      removeFromHistory={removeFromHistory}
                      key={`history_${index}`}
                    />
                  );
                })}
                <button
                  className="addToBut mt-4 p-1 px-3"
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "2px solid gray",
                  }}
                  onClick={() => removeFromHistory(["all"], ["all"])}
                >
                  Clear recent searches
                </button>
              </div>
            </>
          )}
          {view === "autocomplete" && (
            <div
              className="overflow-scroll px-2 pe-4"
              style={{ paddingBottom: "150px" }}
            >
              {acResult?.map((item) => (
                <SearchCard
                  data={item}
                  ac={true}
                  key={item.id}
                  setGlobalLike={handleLocalLike}
                />
              ))}
              <button className="iconButton p-0">
                <p className="labelText text-wheat fs-6 mt-2 fw-normal">
                  {`See more results for "${searchInput}"`}
                </p>
              </button>
            </div>
          )}
          {view === "search" && (
            <div
              className="overflow-scroll px-2 pt-4"
              style={{ paddingBottom: "150px" }}
            >
              {searchResult?.map((item) => (
                <SearchCard
                  data={item}
                  ac={false}
                  key={item.id}
                  setGlobalLike={handleLocalLike}
                />
              ))}
              {originalResponse.hasMore && !filterActive.current && (
                <div ref={moreRef}>
                  <PageLoader />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
