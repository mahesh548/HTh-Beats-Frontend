import { toast } from "sonner";

let currentToastId = null;
const styleTable = {
  img: "img-toast",
  btn: "btn-toast",
  imgBtn: "img-btn-toast",
};
export const showToast = ({
  text,
  image,
  actionText,
  onAction,
  type = "",
  actionRequired = false,
}) => {
  // Dismiss the previous toast if it exists
  if (currentToastId) {
    toast.dismiss(currentToastId);
  }

  const id = String(Date.now()); // Generate new unique id
  currentToastId = id; // Save current

  const styleClass = styleTable[type] || "";

  toast.custom(
    (t) => (
      <div
        onClick={() => {
          if (actionRequired) return;
          toast.dismiss(t);
        }}
        className={`toast ${styleClass}`}
        style={{
          bottom: "110px",
          left: "50%",
          transform: "translateX(-50%)",
          position: "fixed",
          width: "100%",
        }}
      >
        {image && <img src={image} alt="toast icon" />}
        <p>{text}</p>
        {actionText && onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
              toast.dismiss(t);
            }}
            className="iconButton text-primary"
          >
            {actionText}
          </button>
        )}
      </div>
    ),
    {
      id,
      duration: actionRequired ? 10000000000 : 4000,
    }
  );
};
