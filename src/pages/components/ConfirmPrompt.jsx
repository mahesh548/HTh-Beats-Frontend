import { useContext } from "react";
import { HashContext } from "./Hash";

export default function ConfirmPrompt({
  id,
  title = "Are you sure!",
  body,
  butText,
  onConfirm,
}) {
  const { openElements, close } = useContext(HashContext);

  const handleClick = () => {
    onConfirm();
    close(id);
  };
  if (!openElements.includes(id)) return <></>;
  return (
    <div className="confirmPromptCont" onClick={() => close(id)}>
      <div className="confirmCard">
        <b className="text-center fs-4">{title}</b>
        <p className="text-center">{body}</p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents backdrop's onClick from firing
            handleClick();
          }}
          className="addToBut"
        >
          {butText}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents backdrop's onClick from firing
            close(id);
          }}
          className="iconButton text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
