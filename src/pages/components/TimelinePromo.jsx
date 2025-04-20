import { ChevronRight } from "@mui/icons-material";
import utils from "../../../utils";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import Offcanvas from "./BottomSheet";
import { HashContext } from "./Hash";
import TimelineSquare from "./TimelineSquare";
export default function TimelinePromo({ promo }) {
  const homeCache = JSON.parse(localStorage.homeCache);
  const { openElements, open, close } = useContext(HashContext);
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
        onClick={() => open(key)}
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
        {createPortal(
          <Offcanvas
            open={openElements.includes(key)}
            dismiss={() => close(key)}
          >
            <p className="labelText text-center mt-0">{title}</p>
            <hr className="dividerLine" />
            <div className="promoShow mt-4">
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
                  />
                );
              })}
            </div>
          </Offcanvas>,
          document.body
        )}
      </div>
    );
  });
  return promoElements;
}
