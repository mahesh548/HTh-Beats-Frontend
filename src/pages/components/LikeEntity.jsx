import { useCallback, useEffect, useState } from "react";
import utils from "../../../utils";
import { debounce } from "lodash";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import likeFilled from "../../assets/icons/likeFilled.svg";
import { showToast } from "./showToast";

export default function LikeEntity({ isLiked, styleClass, likeData }) {
  const [likeIt, setLikeIt] = useState(false);

  useEffect(() => {
    setLikeIt(isLiked);
  }, []);

  const save = async () => {
    setLikeIt(true);

    callApi("like");
  };
  const unSave = async () => {
    setLikeIt(false);

    callApi("dislike");
  };

  const callApi = useCallback(
    debounce((action) => {
      const req = async () => {
        if (action == "like") {
          const response = await utils.BACKEND("/save", "POST", {
            savedData: likeData,
          });
          if (response?.status == true) {
            showToast({
              text: "Added to your library",
            });
            setLikeIt(true);
          }
        } else {
          const response = await utils.BACKEND("/save", "DELETE", {
            savedData: likeData,
          });
          if (response?.status == true) {
            showToast({
              text: "Removed from your library",
            });
            setLikeIt(false);
          }
        }
      };
      req();
    }, 500),
    [likeData]
  );

  return likeIt ? (
    <button className={styleClass} onClick={() => unSave()}>
      <img src={likeFilled} />
    </button>
  ) : (
    <button className={styleClass} onClick={() => save()}>
      <img src={likeOutlined} />
    </button>
  );
}
