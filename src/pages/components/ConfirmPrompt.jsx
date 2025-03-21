import { useContext } from "react";
import { HashContext } from "./Hash";

export default function ConfirmPrompt({ id, title, body, butText, onConfirm }) {
  const { openElements, close } = useContext(HashContext);

  const handleClick = () => {
    alert();
  };
  if (!openElements.includes(id)) return <></>;
  return (
    <div className="confirmPromptCont" onClick={() => close(id)}>
      <div className="confirmCard">
        <b className="text-center fs-4">{title}</b>
        <p className="text-center">{body}</p>
        <button onClick={handleClick} className="addToBut">
          {butText}
        </button>
        <button onClick={() => close(id)} className="iconButton text-black">
          Cancel
        </button>
      </div>
    </div>
  );
}
