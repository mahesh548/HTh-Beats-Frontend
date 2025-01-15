import { useNavigate, Outlet } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Auth";
export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      console.log(isAuth);
      if (!isAuth) {
        localStorage.clear();
        navigate("/HTh-Beats");
      }
    };
    checkAuth();
  }, []);
  return (
    <>
      <h1>Navbar</h1>
      <Outlet />
    </>
  );
}
