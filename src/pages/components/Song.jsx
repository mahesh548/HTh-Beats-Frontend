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

const songReducer = (state, action) => {
  switch (action.type) {
    case "PLAYLIST":
      return { ...state, playlist: action.value };

    case "SONG":
      return { ...state, song: action.value };

    case "STATUS":
      return { ...state, status: action.value };

    case "NEW":
      return { ...action.value };
    case "NEXT":
      return { ...state, song: playNext(state), status: "play" };
    case "PREV":
      return { ...state, song: playPrev(state), status: "play" };
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
