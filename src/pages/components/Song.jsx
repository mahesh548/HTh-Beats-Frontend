import { createContext, useReducer } from "react";
import utils from "../../../utils";
export const songContext = createContext();

const playNext = (Queue) => {
  const list = Queue.playlist.list;
  const currentIndex = list.indexOf(utils.getItemFromId(Queue.song, list));
  if (currentIndex < list.length) {
    return list[currentIndex + 1].id;
  } else {
    return list[currentIndex].id;
  }
};
const playPrev = (Queue) => {
  const list = Queue.playlist.list;
  const currentIndex = list.indexOf(utils.getItemFromId(Queue.song, list));
  if (currentIndex > 0) {
    return list[currentIndex - 1].id;
  } else {
    return list[currentIndex].id;
  }
};
let historyRequest = null;
const createHistory = (Queue, songId) => {
  clearTimeout(historyRequest);
  const type =
    Queue.playlist.type == "playlist" ||
    Queue.playlist.type == "album" ||
    Queue.playlist.type == "mix"
      ? "entity"
      : Queue.playlist.type;
  const playedData = {
    activity: "played",
    playlistId: Queue.playlist.id,
    idList: [songId],
    type: type,
  };
  const timeDelay =
    (parseInt(
      Queue.playlist.list.find((item) => item.id == songId).more_info.duration
    ) /
      2) *
    1000;

  console.log("history will be created in: ", timeDelay);
  historyRequest = setTimeout(() => {
    utils.BACKEND("/song_played", "POST", { playedData: playedData });
  }, 2000);
};
const songReducer = (state, action) => {
  let liked = [];
  switch (action.type) {
    case "PLAYLIST":
      action.value.list.forEach((item) => {
        if (item.savedIn.length > 0) {
          liked.push(item.id);
        }
      });
      return { ...state, playlist: action.value, saved: liked };

    case "SONG":
      const songId = action.value;
      createHistory(state, songId);
      return {
        ...state,
        song: songId,
        status: "play",
        previous: [...new Set([...state.previous, songId])],
      };

    case "STATUS":
      return { ...state, status: action.value };

    case "NEW":
      action.value.playlist.list.forEach((item) => {
        if (item.savedIn.length > 0) {
          liked.push(item.id);
        }
      });
      createHistory(action.value, action.value.song);
      return { ...action.value, saved: liked, previous: [action.value.song] };
    case "NEXT":
      const nextId = playNext(state);
      createHistory(state, nextId);
      return {
        ...state,
        song: nextId,
        status: "play",
        previous: [...new Set([...state.previous, nextId])],
      };
    case "PREV":
      const prevId = playPrev(state);
      createHistory(state, prevId);
      return {
        ...state,
        song: prevId,
        status: "play",
        previous: [...new Set([...state.previous, prevId])],
      };
    default:
      return { ...state };
  }
};

export default function SongWrap({ children }) {
  const [Queue, setQueue] = useReducer(songReducer, {});

  return (
    <songContext.Provider value={{ Queue, setQueue }}>
      {children}
    </songContext.Provider>
  );
}
