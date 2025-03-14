import { useState } from "react";

export default function ChipSort({ filterData, filter }) {
  const [active, setActive] = useState({ parent: "all", value: false });
  return (
    <div className="ps-1 mt-2">
      <div className="chipActive">
        <button className="px-3 py-1 ">Playlist</button>
        <button className="px-3 py-1 ">By HTh-Beats</button>
      </div>
      <div className="inActiveChip ms-2"></div>
    </div>
  );
}
