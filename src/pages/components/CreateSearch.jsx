import { useContext } from "react";
import { AuthContext } from "./Auth";

import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";

export default function CreateSearch() {
  const auth = useContext(AuthContext);
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
    </div>
  );
}
