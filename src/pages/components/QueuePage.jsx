import BackButton from "./BackButton";
import { SortRounded } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { songContext } from "./Song";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

export default function QueuePage() {
  const [chips, setChips] = useState("next");
  const { Queue, setQueue } = useContext(songContext);

  const onSortEnd = (oldIndex, newIndex) => {
    /* setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex)); */
    console.log(oldIndex);
    console.log(newIndex);
  };
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
      {chips == "next" && (
        <div className="upNextCont">
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged"
          >
            {Queue.playlist.list.map((item) => (
              <SortableItem key={item.id}>
                <div className="item">{item.title}</div>
              </SortableItem>
            ))}
          </SortableList>
        </div>
      )}
    </div>
  );
}
