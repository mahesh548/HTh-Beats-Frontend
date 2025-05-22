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
    <div
      className="page position-absolute w-100 hiddenScrollbar initialPage hiddenScrollbar deskScroll"
      style={{
        background:
          "linear-gradient(180deg, #ffffff2e 0 20%, #00000000 70% 100%)",
      }}
    >
      <div className="pcWrap">
        <div className="launchWrap">
          <div className="text-center">
            <img src="./logo.png" height="70px" width="70px" className="mb-3" />
            <p className="labelText mt-0 fs-2">Millions of songs.</p>
            <p className="labelText mt-0 fs-2">Free on HTh Beats.</p>
          </div>

          <div className="px-4 w-100 pb-4">
            <button
              onClick={goToSignup}
              className="addToBut w-100 fw-bold bg-white"
            >
              Sign up for free
            </button>
            <button
              onClick={goToLogin}
              className="addToBut w-100 fw-bold text-white"
              style={{
                background: "transparent",
                border: "1.5px solid #ffffff91",
              }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
