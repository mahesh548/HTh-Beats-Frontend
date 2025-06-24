import { createContext, useEffect, useReducer, useRef } from "react";
import utils from "../../../utils";
import { useLocation } from "react-router";

export const songContext = createContext();

const playNext = (Queue) => {
  const list = Queue.playlist.list;
  const currentIndex = list.findIndex((item) => item.id == Queue.song);
  if (currentIndex < list.length - 1) {
    return list[currentIndex + 1].id;
  } else {
    return list[currentIndex].id;
  }
};
const playPrev = (Queue) => {
  const list = Queue.playlist.list;
  const currentIndex = list.findIndex((item) => item.id == Queue.song);
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

  // create flag for hit and play from search
  const lastSearchPlay = JSON.parse(sessionStorage.getItem("lastSearchPlay"));
  const now = Date.now();
  let mode = "auto";

  if (
    lastSearchPlay &&
    lastSearchPlay.songId === songId &&
    now - lastSearchPlay.timestamp < 10000 // 10 sec window
  ) {
    mode = "manual";
    sessionStorage.removeItem("lastSearchPlay");
  }

  const playedData = {
    activity: "played",
    playlistId: Queue.playlist.id,
    idList: [songId],
    type: type,
    mode: mode,
  };
  const timeDelay =
    (parseInt(
      Queue.playlist.list.find((item) => item.id == songId).more_info.duration
    ) /
      2) *
    1000;

  historyRequest = setTimeout(() => {
    utils.BACKEND("/song_played", "POST", { playedData: playedData });
  }, timeDelay);
};

const songReducer = (state, action) => {
  let liked = [];
  let effect = JSON.parse(localStorage.getItem("frequency")) || "none";
  let fx = JSON.parse(localStorage.getItem("fx")) || "none";
  switch (action.type) {
    case "RESET":
      return {};

    case "PLAYLIST":
      action.value.list.forEach((item) => {
        if (item.savedIn.length > 0) {
          liked.push(item.id);
        }
      });
      return {
        ...state,
        playlist: action.value,
        saved: liked,
        isLocal: true,
        effect: effect,
        fx: fx,
      };

    case "AUDIO_EFFECT":
      localStorage.setItem("frequency", JSON.stringify(action.value));
      return { ...state, effect: action.value, fx: fx };

    case "AUDIO_FX":
      localStorage.setItem("fx", JSON.stringify(action.value));
      return { ...state, effect: effect, fx: action.value };

    case "SONG":
      const songId = action.value;
      createHistory(state, songId);
      return {
        ...state,
        song: songId,
        status: "play",
        previous: [...new Set([...state.previous, songId])],
        isLocal: true,
        effect: effect,
        fx: fx,
      };

    case "STATUS":
      return {
        ...state,
        status: action.value,
        isLocal: true,
        effect: effect,
        fx: fx,
      };

    case "NEW":
      action.value.playlist.list.forEach((item) => {
        if (item.savedIn.length > 0) {
          liked.push(item.id);
        }
      });
      const queueStation = action.value.playlist.list
        .map((item) => item.id)
        .slice(0, 9);
      createHistory(action.value, action.value.song);
      return {
        ...action.value,
        saved: liked,
        previous: [action.value.song],
        isLocal: true,
        queueStation: queueStation,
        effect: effect,
        fx: fx,
      };

    case "REMOTE_NEW":
      action.value.playlist.list.forEach((item) => {
        if (item.savedIn.length > 0) {
          liked.push(item.id);
        }
      });
      createHistory(action.value, action.value.song);
      return {
        ...action.value,
        saved: liked,
        previous: [action.value.song],
        isLocal: false,
        effect: effect,
        fx: fx,
      };

    case "NEXT":
      const nextId = playNext(state);
      createHistory(state, nextId);
      return {
        ...state,
        song: nextId,
        status: "play",
        previous: [...new Set([...state.previous, nextId])],
        isLocal: true,
        effect: effect,
        fx: fx,
      };

    case "PREV":
      const prevId = playPrev(state);
      createHistory(state, prevId);
      return {
        ...state,
        song: prevId,
        status: "play",
        previous: [...new Set([...state.previous, prevId])],
        isLocal: true,
        effect: effect,
        fx: fx,
      };

    default:
      return { ...state };
  }
};

export default function SongWrap({ children }) {
  const location = useLocation();
  const stationId = useRef(null);
  const initialQueue =
    location.pathname.includes("/join") || location.pathname.includes("/room")
      ? {}
      : JSON.parse(localStorage.getItem("QUEUE") || "{}");

  const [Queue, setQueue] = useReducer(songReducer, initialQueue);

  useEffect(() => {
    if (!Queue && Queue.length == 0) return;
    if (!Queue.isLocal) return;
    const cacheQueue = JSON.parse(JSON.stringify(Queue));
    cacheQueue.status = "stop";
    localStorage.setItem("QUEUE", JSON.stringify(cacheQueue));
    const currentIndex = Queue.playlist.list.findIndex(
      (item) => item.id == Queue.song
    );
    if (
      !Queue?.queueStation ||
      currentIndex + 2 < Queue.playlist.list.length ||
      Queue.status == "stop"
    )
      return;

    getStation(Queue.queueStation, Queue.playlist);
  }, [Queue]);

  const getStation = async (queueStation, oldPlaylist) => {
    if (queueStation === stationId.current) return;
    stationId.current = queueStation;
    const response = await utils.API("/queue", "POST", {
      ids: queueStation,
    });
    if (response.status && response.data) {
      const alreadyInQueue = oldPlaylist.list.map((item) => item.id);
      const freshList = response.data.filter(
        (item) => !alreadyInQueue.includes(item.id)
      );
      const newPL = {
        ...oldPlaylist,
        list: [...oldPlaylist.list, ...freshList],
      };
      setQueue({ type: "PLAYLIST", value: newPL });
    }
  };

  return (
    <songContext.Provider value={{ Queue, setQueue }}>
      {children}
    </songContext.Provider>
  );
}
