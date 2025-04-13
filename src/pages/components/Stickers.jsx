import { useEffect, useState } from "react";
import utils from "../../../utils";
import Emoji from "./Emoji";

const stickerPack = [
  {
    name: "emoji",
    id: "39",
    count: 80,
  },
  {
    name: "duck",
    id: "18",
    count: 28,
  },
  {
    name: "flame",
    id: "16",
    count: 22,
  },
  {
    name: "patrick",
    id: "12",
    count: 16,
  },
  {
    name: "gorilla",
    id: "6",
    count: 16,
  },
  {
    name: "fish",
    id: "16",
    count: 23,
  },
  {
    name: "cherry",
    id: "26",
    count: 33,
  },
];

export default function Stickers({ pack = "emoji" }) {
  const [packName, setPackName] = useState(pack);
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    const stickerList = [];
    const currentPack = stickerPack.find((item) => item.name == packName);
    for (let i = 1; i <= currentPack.count; i++) {
      stickerList.push(utils.stickerUrl(packName, i));
    }
    setStickers(stickerList);
    console.log("stickers", stickerList);
  }, [packName]);

  return (
    <div>
      <div className="stkNav hiddenScrollbar mb-4">
        {stickerPack.map((item, index) => (
          <button
            key={"nav-sticker" + index}
            className={`iconButton pop ${
              packName == item.name ? "activeSticker" : ""
            }`}
            onClick={() => setPackName(item.name)}
          >
            <Emoji src={utils.stickerUrl(item.name, item.id)} />
          </button>
        ))}
      </div>
      <div className="stkCont">
        {stickers.map((item, index) => {
          return (
            <button
              key={pack + "-sticker-" + index}
              className="iconButton pop"
              onClick={() => console.log(item)}
            >
              <Emoji
                src={item}
                imageStyleClass="w-100"
                loaderStyleClass="w-100 ratio ratio-1x1"
                key={pack + "-emoji-" + index}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
