import { useNavigate } from "react-router";
export default function Launch() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <h1>HTh-Beats</h1>
      <div>
        <button onClick={goToLogin}>Login</button>
        <button onClick={goToSignup}>Signup</button>
      </div>
    </>
  );
}
