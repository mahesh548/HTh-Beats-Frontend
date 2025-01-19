import { ChevronRight } from "@mui/icons-material";
import utils from "../../../utils";
import { useState } from "react";

export default function TimelinePromo({ promo }) {
  const homeCache = JSON.parse(localStorage.homeCache);
  const setBackgroundColor = async (img, setColor) => {
    const color = await utils.getAverageColor(img);
    setColor(color);
  };
  const promoElements = Object.keys(promo).map((key) => {
    const data = promo[key];
    const { type } = data[0];
    const language = data[0]?.more_info?.editorial_language;
    const { title } = homeCache?.modules[key];
    let featuredPlaylist = [];
    data.forEach((item) => featuredPlaylist.push(item.title));
    const [color, setColor] = useState("");
    setBackgroundColor(data[0].image, setColor);
    return (
      <div
        className="promoContainer"
        key={key}
        style={{ backgroundColor: color }}
      >
        <div>
          <p className="promoTitle">{title}</p>
          <p className="thinTwoLineText promoSubtitle">
            {utils.capitalLetter(type)}
            {` • ${data.length} items`}
            {language ? ` • ${utils.capitalLetter(language)}` : " • Hindi"}
          </p>
        </div>
        <div className="smallFourBanner">
          <img src={data[0].image} alt="HTh-Beats" />
          <img src={data[1].image} alt="HTh-Beats" />
          <img src={data[2].image} alt="HTh-Beats" />
          <img src={data[3].image} alt="HTh-Beats" />
        </div>
        <div className="promoDetails">
          <p className="thinTwoLineText">{featuredPlaylist.join(", ")}</p>
          <button>
            <ChevronRight />
          </button>
        </div>
      </div>
    );
  });
  return promoElements;
}
