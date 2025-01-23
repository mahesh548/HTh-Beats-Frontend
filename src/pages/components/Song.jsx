import { createContext, useReducer, useState } from "react";

export const songContext = createContext();

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
