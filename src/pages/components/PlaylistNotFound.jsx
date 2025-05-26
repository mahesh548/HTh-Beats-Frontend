import { Link } from "react-router";

export default function PlaylistNotFound() {
  return (
    <div className="page">
      <div className="text-center" style={{ marginTop: "6rem" }}>
        <img src="/logo.png" alt="logo" height="80px" width="80px" />
        <p className="labelText">Page Not Found!</p>
        <p className="text-white-50 mt-2 mb-2">
          It seems like page you are looking for is currently unavailable or
          does not exist.
        </p>
        <Link to="/home" className="text-decoration-none">
          <button className="addToBut">Go to home</button>
        </Link>
      </div>
    </div>
  );
}
