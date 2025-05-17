import { useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import Emoji from "./Emoji";
import { channelContext } from "./Channel";

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
  const { sendReaction } = useContext(channelContext);

  useEffect(() => {
    const stickerList = [];
    const currentPack = stickerPack.find((item) => item.name == packName);
    for (let i = 1; i <= currentPack.count; i++) {
      stickerList.push(utils.stickerUrl(packName, i));
    }
    setStickers(stickerList);
  }, [packName]);

  return (
    <div>
      <div className="stkNav hiddenScrollbar mb-2">
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
      <hr className="dividerLine mb-4" />
      <div className="stkCont hiddenScrollbar deskScroll">
        {stickers.map((item, index) => {
          return (
            <button key={pack + "-sticker-" + index} className="iconButton pop">
              <Emoji
                src={item}
                imageStyleClass="w-100"
                loaderStyleClass="w-100 ratio ratio-1x1"
                key={pack + "-emoji-" + index}
                click={() => sendReaction(packName, index + 1)}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
