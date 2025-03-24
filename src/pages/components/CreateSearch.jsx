import { useContext } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";

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
          <p className="labelText">Browse all</p>
          <div className="browseCont mt-3">
            {discover.map((item) => {
              return (
                <button
                  className="browseCard"
                  key={`dicover_${Math.random().toString(36).substr(2, 9)}`}
                  style={{ background: item?.more_info?.color }}
                >
                  <p className="text-white text-start fw-bold p-1">
                    {item?.title}
                  </p>
                  <img src={item.image} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
