import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function BackButton({ styleClass = "" }) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <button
      className={`backButtonPlaylist ${styleClass}`}
      onClick={() => {
        goBack();
      }}
    >
      <ArrowBack />
    </button>
  );
}
