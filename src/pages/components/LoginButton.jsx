export default function LoginButton({ text, disabled, func }) {
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
