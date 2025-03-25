import { useContext, useMemo } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import { HashContext } from "./Hash";
import CreateRadio from "./CreateRadio";

export default function CreateSearch() {
  const auth = useContext(AuthContext);
  const discover = localStorage?.homeCache
    ? JSON.parse(localStorage.homeCache).radio
    : false;

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryNavCont px-2 position-relative">
        <div className="libraryNav mt-4 mb-3">
          <img src={auth?.user?.pic || "logo.png"} className="rounded-circle" />
          <p className="labelText mt-0">Search</p>
        </div>
      </div>
      <button className="srchOpenBut">
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
    </div>
  );
}
