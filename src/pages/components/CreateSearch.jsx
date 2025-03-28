import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { HashContext } from "./Hash";
import CreateRadio from "./CreateRadio";
import { ArrowBack, Close } from "@mui/icons-material";
import utils from "../../../utils";
import PageLoader from "./PageLoader";
import SearchCard from "./SearchCard";

export default function CreateSearch() {
  const auth = useContext(AuthContext);
  const { openElements, open, close } = useContext(HashContext);
  const [searchInput, setSearchInput] = useState("");
  const [view, setView] = useState(
    localStorage.history ? "history" : "default"
  );
  const [acResult, setAcResult] = useState();
  const [searchResult, setSearchResult] = useState();

  const discover = localStorage?.homeCache
    ? JSON.parse(localStorage.homeCache).radio
    : false;

  let searchTimeOut = useRef(null);
  useEffect(() => {
    clearTimeout(searchTimeOut.current);
    if (searchInput.length == 0) {
      setView(localStorage.history ? "history" : "default");
      return;
    }

    searchTimeOut.current = setTimeout(() => {
      autoComplete(searchInput);
    }, 1000);
  }, [searchInput]);

  const autoComplete = async (query) => {
    setView("loading");
    const response = await utils.API(`/search?q=${query}&autocomplete=true`);
    if (response.status && response.data) {
      setAcResult(sortResponse(response.data, query));
      setView("autocomplete");
    }
  };
  const search = async (query) => {
    setView("loading");
    const response = await utils.API(`/search?q=${query}&autocomplete=false`);
    if (response.status && response.data) {
      setSearchResult(sortResponse(response.data, query));
      setView("search");
    }
  };

  const processInput = (value) => {
    setSearchInput(value);
    if (value.length == 0)
      setView(localStorage.history ? "history" : "default");
  };

  const sortResponse = (data, query) => {
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

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryNavCont px-2 position-relative">
        <div className="libraryNav mt-4 mb-3">
          <img src={auth?.user?.pic || "logo.png"} className="rounded-circle" />
          <p className="labelText mt-0">Search</p>
        </div>
      </div>
      <button className="srchOpenBut" onClick={() => open("search")}>
        <img src={searchSvgOutlined} />
        <p className="text-start">Hey, what do you want to listen ?</p>
      </button>
      {discover && (
        <>
          <p className="labelText px-1">Browse all</p>
          <div className="browseCont mt-3 px-1">
            {discover.map((item) => {
              return (
                <CreateRadio
                  data={item}
                  key={`dicover_${Math.random().toString(36).substr(2, 9)}`}
                />
              );
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
            placeholder="Hey, what do you want to listen ?"
            className="srchInput"
            value={searchInput}
            onInput={(e) => processInput(e.target.value)}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search(e.target.value);
              }
            }}
          />
          {searchInput.length > 0 && (
            <button className="iconButton" onClick={() => setSearchInput("")}>
              <Close />
            </button>
          )}
        </div>
        <div className="searchMain hiddenScrollbar">
          {view == "default" && (
            <div className="defaultCont">
              <p className="text-white fs-5">Search what you like</p>
              <p className="text-white-50 fs-6">
                Search for artists, songs, playlist and more.
              </p>
            </div>
          )}
          {view == "loading" && <PageLoader />}
          {view == "history" && <div className="historyCont"></div>}
          {view == "autocomplete" && (
            <div
              className="overflow-scroll px-2 pe-4"
              style={{ paddingBottom: "150px" }}
            >
              {acResult.map((item) => {
                return (
                  <SearchCard
                    data={item}
                    ac={true}
                    key={`${Math.random().toString(36).substr(2, 9)}`}
                  />
                );
              })}
              <button className="iconButton p-0">
                <p className="labelText text-wheat fs-6 mt-2 fw-normal">
                  {`See more results for "${searchInput}"`}
                </p>
              </button>
            </div>
          )}
          {view == "search" && (
            <div
              className="overflow-scroll px-2"
              style={{ paddingBottom: "150px" }}
            >
              {searchResult.map((item) => {
                return (
                  <SearchCard
                    data={item}
                    ac={false}
                    key={`${Math.random().toString(36).substr(2, 9)}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
