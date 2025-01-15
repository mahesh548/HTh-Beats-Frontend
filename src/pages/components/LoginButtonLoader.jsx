export default function LoginButtonLoader() {
  return (
    <button
      className="customLoginButton"
      style={{ height: "44px", opacity: 1 }}
    >
      <div className="spinner-border spinner-custom" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </button>
  );
}
