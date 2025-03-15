import { useState } from "react";

export default function ChipSort({ filterData, filter }) {
  const [active, setActive] = useState("/all");

  const toggle = (value) => {
    setActive((prev) => {
      const newFilter = prev.includes(value)
        ? prev.split("/").slice(0, prev.split("/").indexOf(value)).join("/") ||
          "/"
        : prev + "/" + value;

      filter(newFilter.split("/").at(-1), newFilter.split("/").at(-1));
      return newFilter;
    });
  };
  const current = active.split("/").slice(1, active.split("/").length);
  console.log(current);
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
      <div className="inActiveChip ms-2">
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
