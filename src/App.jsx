//dependencies
import { Routes, Route } from "react-router";

//pages
import Launch from "./pages/Launch";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

//css
import "./style.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/HTh-Beats" element={<Launch />} />
      <Route path="/" element={<Main />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
