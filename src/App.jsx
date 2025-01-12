import Launch from "./pages/Launch";
import { Routes, Route, Router } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}
