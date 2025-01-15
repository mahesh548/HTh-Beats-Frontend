//dependencies
import { Routes, Route } from "react-router";

//pages
import Launch from "./pages/Launch";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";

//css
import "./style.css";
import ChooseUsername from "./pages/ChooseUsername";
import Loader from "./pages/Loader";

//components
import Navbar from "./pages/components/Navbar";

export default function App() {
  return (
    <Routes>
      {/* LOGIN NOT REQUIRED */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/username" element={<ChooseUsername />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/HTh-Beats" element={<Launch />} />
      <Route path="/" element={<Loader />} />

      {/* LOGIN REQUIRED */}
      <Route element={<Navbar />}>
        <Route path="/home" element={<Home />} />
      </Route>

      {/* ERROR PAGES */}
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
