export default function TimelineSquare({ img, text, id, type, style = "" }) {
  const func = () => {
    console.log(text);
    console.log(id);
    console.log(type);
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
