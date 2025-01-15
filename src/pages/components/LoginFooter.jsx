import { useNavigate } from "react-router";
export default function LoginFooter({ text, url }) {
  const navigate = useNavigate();
  return (
    <button className="changeM" onClick={() => navigate(url)}>
      {text}
    </button>
  );
}
