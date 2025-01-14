//dependencies
import { Routes, Route } from "react-router";
import { useContext, useState, useEffect } from "react";

//context
import { AuthContext } from "./pages/components/Auth";

//pages
import Launch from "./pages/Launch";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

//css
import "./style.css";

export default function App() {
  const [main, setMain] = useState(<h1>loading...</h1>);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      console.log(isAuth);
      if (isAuth) {
        setMain(<Main />);
      } else {
        setMain(<Launch />);
      }
    };
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={main} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
