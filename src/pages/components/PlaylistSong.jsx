import { MoreVertRounded } from "@mui/icons-material";
import utils from "../../../utils";
import likeFilled from "../../assets/icons/likeFilled.svg";
export default function PlaylistSong({ data, func, more_func }) {
  return (
    <div className="playlistSong">
      <img src={data.image} alt={data.title} className="playlistSongImg" />
      <div>
        <p className="thinOneLineText playlistSongTitle">
          {utils.refineText(data.title)}
        </p>
        <p className="thinOneLineText playlistSongSubTitle">
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
