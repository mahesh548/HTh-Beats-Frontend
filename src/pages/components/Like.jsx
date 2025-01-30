import { useCallback, useEffect, useState } from "react";
import utils from "../../../utils";
import { debounce } from "lodash";

export default function Like({
  isLiked,
  styleClass,
  outlinedSrc,
  filledSrc,
  likeData,
  depend,
}) {
  const [likeIt, setLikeIt] = useState();

  useEffect(
    () => {
      setLikeIt(isLiked);
    },
    depend ? [depend] : []
  );

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
            setLikeIt(true);
          }
        } else {
          const response = await utils.BACKEND("/save", "DELETE", {
            savedData: likeData,
          });
          if (response?.status == true) {
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
      <img src={filledSrc} />
    </button>
  ) : (
    <button className={styleClass} onClick={() => save()}>
      <img src={outlinedSrc} />
    </button>
  );
}
