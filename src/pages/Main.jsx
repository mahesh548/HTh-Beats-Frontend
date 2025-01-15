import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/Auth";
export default function Main() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      console.log(isAuth);
      if (!isAuth) {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);
  return (
    <div>
      <h1>Main</h1>
    </div>
  );
}
