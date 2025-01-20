import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/Auth";
export default function Loader() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      if (isAuth) {
        navigate("/home");
      } else {
        localStorage.clear();
        navigate("/HTh-Beats");
      }
    };
    checkAuth();
  }, []);
  return (
    <div className="page">
      <h1>Loading...</h1>
    </div>
  );
}
