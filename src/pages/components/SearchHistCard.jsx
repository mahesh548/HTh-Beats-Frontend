import { useNavigate } from "react-router";
import utils from "../../../utils";
import { useContext, useMemo } from "react";
import { songContext } from "./Song";
import { Close } from "@mui/icons-material";

export default function SearchHistCard({ data, removeFromHistory }) {
  const { Queue } = useContext(songContext);

  const navigate = useNavigate();

  const showResult = (data) => {
    navigate(`/${data?.type || "song"}/${data?.url || data?.perma_url}`);
  };

  return (
    <>
      <div
        className="playlistSong mt-3"
        style={{ gridTemplateColumns: "50px auto 40px" }}
      >
        <img
          src={data.image}
          alt={`${data?.title || data?.name}`}
          className="playlistSongImg rounded"
          onClick={() => showResult(data)}
        />
        <div onClick={() => showResult(data)}>
          <p
            className="thinOneLineText playlistSongTitle fw-normal"
            style={{ color: data.id == Queue.song ? "wheat" : "#ffffff" }}
          >
            {utils.refineText(data?.title || data?.name)}
          </p>
          <p className="thinOneLineText playlistSongSubTitle">
            Song
            {data.subtitle ? ` · ${utils.refineText(data.subtitle)}` : ""}
          </p>
        </div>

        <button
          className="iconButton"
          onClick={(e) => {
            e.stopPropagation();
            removeFromHistory([data.id], [data.historyId]);
          }}
        >
          <Close className="text-white-50" />
        </button>
      </div>
    </>
  );
}
