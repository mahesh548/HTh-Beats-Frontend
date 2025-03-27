import { useNavigate } from "react-router";
import utils from "../../../utils";
export default function SearchCard({ data, ac }) {
  const navigate = useNavigate();
  const showResult = (type, id) => {
    navigate(`/${type}/${id}`);
  };
  return (
    <div className="playlistSong mt-4">
      <img
        src={data.image}
        alt={`${data?.title || data?.name}`}
        className={`playlistSongImg rounded ${
          data.type == "artist" ? "rounded-circle" : ""
        }`}
        onClick={() => showResult(data.type, data?.perma_url || data?.url)}
      />
      <div
        className={`${ac ? "extendedGrid" : ""}`}
        onClick={() => showResult(data.type, data?.perma_url || data?.url)}
      >
        <p
          className="thinOneLineText playlistSongTitle"
          style={{ color: false ? "wheat" : "#ffffff" }}
        >
          {utils.refineText(data?.title || data?.name)}
        </p>
        <p className="thinOneLineText playlistSongSubTitle">
          {utils.capitalLetter(data.type)}
          {data.subtitle ? ` · ${utils.refineText(data.subtitle)}` : ""}
        </p>
      </div>
      <div></div>
    </div>
  );
}
