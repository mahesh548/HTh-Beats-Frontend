import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TimelineSquare from "./TimelineSquare";
import { useEffect, useRef, useState } from "react";

export default function TimelineSlider({ data, label, style = "" }) {
  const sliderRef = useRef(null);
  const [showScroll, setShowScroll] = useState({ left: false, right: true });
  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = slider.clientWidth * 0.8;

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;

    const handleScroll = () => {
      const isScrollStart = slider.scrollLeft > 0;
      const isScrolledToEnd =
        Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth;
      setShowScroll({
        left: isScrollStart,
        right: !isScrolledToEnd,
      });
    };

    if (slider) {
      slider.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleScroll);
      }
    };
  }, [sliderRef.current]);
  return (
    <>
      <p className="labelText">{label}</p>
      <div className="sliderWrap">
        {showScroll.left && (
          <button
            className="iconButton desk timelineScrollBtn left"
            onClick={() => scrollSlider("left")}
          >
            <ArrowForwardIos style={{ transform: "rotate(180deg)" }} />
          </button>
        )}
        <div className="sliderContainer hiddenScrollbar" ref={sliderRef}>
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
        {showScroll.right && (
          <button
            className="iconButton desk timelineScrollBtn right"
            onClick={() => scrollSlider("right")}
          >
            <ArrowForwardIos />
          </button>
        )}
      </div>
    </>
  );
}
