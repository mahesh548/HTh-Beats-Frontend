import { useState } from "react";

export default function ChipSort({ filterData, filter }) {
  const [active, setActive] = useState("/all");

  const toggle = (value) => {
    setActive((prev) => {
      const newFilter = { ...prev.filter((item) => item.value != value) };
      filter(newFilter.map((item) => item.value));
      return newFilter;
    });
  };

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
