import utils from "../../../utils";
export default function SearchCard({ data, ac }) {
  return (
    <div className="playlistSong mt-4">
      <img
        src={data.image}
        alt={`${data?.title || data?.name}`}
        className={`playlistSongImg rounded ${
          data.type == "artist" ? "rounded-circle" : ""
        }`}
      />
      <div className={`${ac ? "extendedGrid" : ""}`}>
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
