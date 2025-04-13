import { useState } from "react";
import utils from "../../../utils";
import Emoji from "./Emoji";

const stickerPack = [
  {
    name: "emoji",
    id: "39",
  },
  {
    name: "duck",
    id: "18",
  },
  {
    name: "flame",
    id: "16",
  },
  {
    name: "patrick",
    id: "12",
  },
  {
    name: "gorilla",
    id: "6",
  },
  {
    name: "fish",
    id: "16",
  },
  {
    name: "cherry",
    id: "26",
  },
];

export default function Stickers({ pack = "emoji" }) {
  const [packName, setPackName] = useState(pack);
  return (
    <div>
      <div className="stkNav hiddenScrollbar">
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
    </div>
  );
}
