import { ReactSortable } from "react-sortablejs";
import BackButton from "./BackButton";
import { SortRounded } from "@mui/icons-material";
import { useState } from "react";
export default function QueuePage() {
  const [chips, setChips] = useState("next");
  return (
    <div className="floatingPage">
      <div className="navbarAddTo">
        <BackButton />
        <p>Queue</p>
        <button className="iconButton">
          <SortRounded />
        </button>
      </div>
      <div>
        <button
          className={`chips ${chips == "next" ? "chipsActive" : ""}`}
          onClick={() => setChips("next")}
        >
          Next
        </button>
        <button
          className={`chips ${chips == "prev" ? "chipsActive" : ""}`}
          onClick={() => setChips("prev")}
        >
          Previous
        </button>
      </div>
      {chips == "next" && <div className="upNextCont"></div>}
    </div>
  );
}
