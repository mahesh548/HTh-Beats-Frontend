import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <button
      className="backButtonPlaylist"
      onClick={() => {
        goBack();
      }}
    >
      <ArrowBack />
    </button>
  );
}
