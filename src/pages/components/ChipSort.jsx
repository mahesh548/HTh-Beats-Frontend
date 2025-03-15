import { useState } from "react";

export default function ChipSort({ filterData, filter }) {
  const [active, setActive] = useState("/all");

  const toggle = (value) => {
    const newFilter = active.includes(value)
      ? active
          .split("/")
          .slice(0, active.split("/").indexOf(value))
          .join("/") || "/"
      : active + "/" + value;
    setActive(newFilter);
    filter(newFilter.split("/").at(-1));
  };
  const current = active.split("/").slice(1, active.split("/").length);
  return (
    <div className="ps-1 mt-2">
      <div className="chipActive">
        {current.map((item) => {
          const filterItem = filterData.find(
            (filterItem) => filterItem.value == item
          );
          if (!filterItem) return null;

          return (
            <button className="px-3 py-1 " onClick={() => toggle(item)}>
              {filterItem.label}
            </button>
          );
        })}
      </div>
      <div className="inActiveChip">
        {filterData.map((item) => {
          const current = active.split("/").at(-1);
          if (current == item.parent) {
            return (
              <button className="px-3 py-1 " onClick={() => toggle(item.value)}>
                {item.label}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
