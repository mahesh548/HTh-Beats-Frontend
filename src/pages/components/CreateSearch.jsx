import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { HashContext } from "./Hash";
import CreateRadio from "./CreateRadio";
import { ArrowBack, Close } from "@mui/icons-material";

export default function CreateSearch() {
  const auth = useContext(AuthContext);
  const { openElements, open, close } = useContext(HashContext);
  const [searchInput, setSearchInput] = useState("");

  const discover = localStorage?.homeCache
    ? JSON.parse(localStorage.homeCache).radio
    : false;

  let searchTimeOut = useRef(null);
  useEffect(() => {
    if (searchInput.length == 0) return;
    clearTimeout(searchTimeOut.current);
    searchTimeOut.current = setTimeout(() => {
      console.log(`making request for: ${searchInput}`);
    }, 1000);
  }, [searchInput]);
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
        className="searchCont"
        style={{ display: openElements.includes("search") ? "block" : "none" }}
      >
        <div className="srchBox pe-3">
          <button className="iconButton" onClick={() => close("search")}>
            <ArrowBack />
          </button>
          <input
            type="text"
            placeholder="Hey, what do you want to listen ?"
            className="srchInput"
            value={searchInput}
            onInput={(e) => setSearchInput(e.target.value)}
            spellCheck={false}
          />
          {searchInput.length > 0 && (
            <button className="iconButton" onClick={() => setSearchInput("")}>
              <Close />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
