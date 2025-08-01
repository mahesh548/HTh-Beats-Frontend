import BackButton from "./BackButton";
import { DragIndicator, SortRounded } from "@mui/icons-material";
import { useContext, useMemo, useState } from "react";
import { songContext } from "./Song";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

import { arrayMoveImmutable } from "array-move";
import PlaylistSong from "./PlaylistSong";
import utils from "../../../utils";
import PanelOpen from "../../assets/icons/PanelOpen.svg";
import { HashContext } from "./Hash";
export default function QueuePage() {
  const [chips, setChips] = useState("all");
  const { Queue, setQueue } = useContext(songContext);
  const { close, closeAll } = useContext(HashContext);
  const play = (id) => {
    setQueue({
      type: "SONG",
      value: id,
    });
  };

  const DragHand = SortableHandle(() => {
    return (
      <div className="dragHand">
        <DragIndicator />
      </div>
    );
  });
  const SortableSong = SortableElement(({ item }) => {
    const isLiked = Queue?.saved && Queue?.saved.includes(item.id);
    return (
      <div className="sortPlaylistSong mb-3">
        <DragHand />
        <PlaylistSong
          data={item}
          play={play}
          key={`song_${item.id}`}
          isPlaying={item.id == Queue.song}
          isLiked={item.savedIn.length > 0 || isLiked}
        />
      </div>
    );
  });

  const SortableList = useMemo(() => {
    return SortableContainer(({ items }) => {
      return (
        <div>
          {items.map((item, index) => (
            <SortableSong key={item.id} index={index} item={item} />
          ))}
        </div>
      );
    });
  }, [Queue.playlist.list, Queue.song, Queue.saved]);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newList = arrayMoveImmutable(Queue.playlist.list, oldIndex, newIndex);
    setQueue({
      type: "PLAYLIST",
      value: { ...Queue.playlist, list: newList },
    });
  };
  return (
    <div
      className="queuePage hiddenScrollbar"
      style={{
        backgroundColor: "var(--desktop-dark-grey)",
        overflowY: "scroll",
      }}
    >
      <div className="queuePageLayout">
        <div className="navbarAddTo">
          <BackButton styleClass="mobo" />
          <button
            className="iconButton opacity-50 w-100 desk"
            onClick={() => closeAll(["player", "queue", "lyrics"])}
            title="Hide Queue"
          >
            <img
              src={PanelOpen}
              className="w-100"
              style={{ transform: "scaleX(-1)" }}
            />
          </button>
          <p>Queue</p>
        </div>
        <div className="queueNav">
          <button
            className={`chips m-0 ${chips == "all" ? "chipsActive" : ""}`}
            onClick={() => setChips("all")}
          >
            All
          </button>
          <button
            className={`chips m-0 ${chips == "next" ? "chipsActive" : ""}`}
            onClick={() => setChips("next")}
          >
            Next
          </button>
          {Queue?.previous?.length > 0 && (
            <button
              className={`chips m-0 ${chips == "prev" ? "chipsActive" : ""}`}
              onClick={() => setChips("prev")}
            >
              Previous
            </button>
          )}
        </div>
        {chips == "all" && (
          <div className="upNextCont hiddenScrollbar">
            <SortableList
              items={Queue.playlist.list}
              onSortEnd={onSortEnd}
              useDragHandle={true}
              helperClass="sortableHelper"
              lockAxis="y"
            />
          </div>
        )}
        {chips == "next" && (
          <div className="upNextCont hiddenScrollbar">
            <SortableList
              items={(() => {
                const list = Queue.playlist.list;
                const currentIndex = list.indexOf(
                  utils.getItemFromId(Queue.song, list)
                );
                return list.filter((item) => {
                  return list.indexOf(item) > currentIndex;
                });
              })()}
              onSortEnd={onSortEnd}
              useDragHandle={true}
              helperClass="sortableHelper"
              lockAxis="y"
            />
          </div>
        )}
        {chips == "prev" && (
          <div className="upNextCont hiddenScrollbar prevCont">
            {Queue.playlist.list
              .filter((item) => Queue.previous.includes(item.id))
              .reverse()
              .map((item) => {
                const isLiked = Queue?.saved && Queue?.saved.includes(item.id);
                return (
                  <PlaylistSong
                    data={item}
                    play={play}
                    key={`song_${item.id}`}
                    isPlaying={item.id == Queue.song}
                    isLiked={item.savedIn.length > 0 || isLiked}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
