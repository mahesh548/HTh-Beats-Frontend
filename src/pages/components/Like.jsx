import { useEffect, useState } from "react";
import utils from "../../../utils";

export default function Like({
  isLiked,
  styleClass,
  outlinedSrc,
  filledSrc,
  likeData,
}) {
  const [likeIt, setLikeIt] = useState();

  useEffect(() => {
    setLikeIt(isLiked);
  }, []);
  const save = async () => {
    const response = await utils.BACKEND("/save", "POST", {
      savedData: likeData,
    });
    if (response?.status == true) {
      setLikeIt(true);
    }
  };
  const unSave = async () => {};
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
