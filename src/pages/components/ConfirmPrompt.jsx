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
        <b>{title}</b>
        <p>{body}</p>
        <button onClick={handleClick}>{butText}</button>
        <button onClick={() => close(id)} className="iconButton text-black">
          Cancel
        </button>
      </div>
    </div>
  );
}
