export default function TimelineSquare({ img, text, id, type }) {
  const func = () => {
    console.log(text);
    console.log(id);
    console.log(type);
  };

  return (
    <div
      className={type == "artist" ? "TimelineRoundItem" : "TimelineSquareItem"}
    >
      <img src={img} alt="playlist banner" onClick={() => func()} />
      <p>{text}</p>
    </div>
  );
}
