import utils from "../../../utils";

export default function Like({
  isLiked,
  styleClass,
  outlinedSrc,
  filledSrc,
  data,
}) {
  const save = async () => {
    const response = await utils.BACKEND("/save", "POST", { savedData: data });
    console.log(response);
  };
  const unSave = async () => {};
  return isLiked ? (
    <button className={styleClass} onClick={() => unSave()}>
      <img src={filledSrc} />
    </button>
  ) : (
    <button className={styleClass} onClick={() => save()}>
      <img src={outlinedSrc} />
    </button>
  );
}
