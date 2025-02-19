import { useNavigate } from "react-router";

export default function TimelineSquare({ img, text, id, type, style = "" }) {
  const navigate = useNavigate();
  const func = () => {
    console.log(text);
    console.log(id);
    console.log(type);
    if (type == "playlist") {
      navigate(`/playlist/${id}`);
    }
    if (type == "album") {
      navigate(`/album/${id}`);
    }
    if (type == "mix") {
      navigate(`/mix/${id}`);
    }
  };

  return (
    <div
      className={style == "round" ? "TimelineRoundItem" : "TimelineSquareItem"}
    >
      <img src={img} alt="playlist banner" onClick={() => func()} />
      <p>{text.replaceAll("&quot;", "")}</p>
    </div>
  );
}
