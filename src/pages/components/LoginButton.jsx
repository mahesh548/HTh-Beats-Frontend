export default function LoginButton({ text, formData, func }) {
  return (
    <button
      className="customLoginButton"
      onClick={() => {
        func();
      }}
      disabled={formData.disable}
      style={{ opacity: formData.disable ? 0.5 : 1 }}
    >
      {text}
    </button>
  );
}
