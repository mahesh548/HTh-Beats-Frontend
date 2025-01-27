import { MoreVertRounded } from "@mui/icons-material";
import utils from "../../../utils";
import likeFilled from "../../assets/icons/likeFilled.svg";
export default function PlaylistSong({ data, play, more_opt, isPlaying }) {
  return (
    <div className="playlistSong">
      <img
        src={data.image}
        alt={data.title}
        className="playlistSongImg"
        onClick={() => play(data.id)}
      />
      <div>
        <p
          className="thinOneLineText playlistSongTitle"
          onClick={() => play(data.id)}
          style={{ color: isPlaying ? "wheat" : "#ffffff" }}
        >
          {utils.refineText(data.title)}
        </p>
        <p
          className="thinOneLineText playlistSongSubTitle"
          onClick={() => play(data.id)}
        >
          {data.subtitle?.length != 0
            ? utils.refineText(data.subtitle)
            : utils.refineText(
                `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
              )}
        </p>
      </div>
      <div>
        {/* <button className="playlistSongButton">
          <img src={likeFilled} alt="" />
        </button> */}
      </div>
      <div>
        <button className="playlistSongButton">
          <MoreVertRounded />
        </button>
      </div>
    </div>
  );
}
