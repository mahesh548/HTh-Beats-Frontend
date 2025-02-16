import TimelineSquare from "./TimelineSquare";
export default function TimelineSlider({ data, label, style = "" }) {
  return (
    <>
      <p className="labelText">{label}</p>
      <div className="sliderContainer hiddenScrollbar">
        <div className="slider">
          {" "}
          {data.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={`${id}_${Math.random().toString(36).substr(2, 9)}`}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={style || type == "artist" ? "round" : ""}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
