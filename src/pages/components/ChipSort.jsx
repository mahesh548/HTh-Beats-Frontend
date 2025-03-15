import { Close } from "@mui/icons-material";
import { useState } from "react";

export default function ChipSort({ filterData, filter }) {
  const [active, setActive] = useState("/all");

  const toggle = (value) => {
    if (value == "all") {
      setActive("/all");
      filter("all");
      return;
    }
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
    <div>
      {active.split("/").at(-1) != "all" && (
        <div className="inActiveChip ms-0">
          <button
            style={{ height: "30px", width: "30px" }}
            className="p-0"
            onClick={() => toggle("all")}
          >
            <Close />
          </button>
        </div>
      )}
      <div className="chipActive">
        {current.map((item) => {
          const filterItem = filterData.find(
            (filterItem) => filterItem.value == item
          );
          if (!filterItem) return null;

          return (
            <button
              className="px-2 py-1 "
              onClick={() => toggle(filterItem.value)}
              key={`sort_${filterItem.value}`}
            >
              {filterItem.label}
            </button>
          );
        })}
      </div>
      <div
        className={`inActiveChip ${
          active.split("/").at(-1) != "all" ? "" : "ms-0"
        }`}
      >
        {filterData.map((item) => {
          const current = active.split("/").at(-1);
          if (current == item.parent) {
            return (
              <button
                className="px-2 py-1 "
                onClick={() => toggle(item.value)}
                key={`sort_${item.value}`}
              >
                {item.label}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
