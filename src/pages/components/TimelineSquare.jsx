import { useNavigate } from "react-router";
import utils from "../../../utils";

export default function TimelineSquare({ img, text, id, type, style = "" }) {
  const navigate = useNavigate();
  const func = () => {
    if (type == "playlist") {
      navigate(`/playlist/${id}`);
    }
    if (type == "album") {
      navigate(`/album/${id}`);
    }
    if (type == "mix") {
      navigate(`/mix/${id}`);
    }
    if (type == "artist") {
      navigate(`/artist/${id}`);
    }
    if (type == "song") {
      navigate(`/song/${id}`);
    }
  };

  return (
    <div
      className={style == "round" ? "TimelineRoundItem" : "TimelineSquareItem"}
    >
      <img
        src={img.replace("150x150", "500x500").replace("50x50", "500x500")}
        alt="playlist banner"
        onClick={() => func()}
      />
      <p>{utils.refineText(text)}</p>
    </div>
  );
}
