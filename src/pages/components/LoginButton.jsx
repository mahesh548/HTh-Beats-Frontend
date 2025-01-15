import LoginButtonLoader from "./LoginButtonLoader";
export default function LoginButton({ text, disabled, func, loader }) {
  if (loader) {
    return <LoginButtonLoader />;
  }

  return (
    <button
      className="customLoginButton"
      onClick={() => {
        func();
      }}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {text}
    </button>
  );
}
