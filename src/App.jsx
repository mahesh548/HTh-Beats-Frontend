//dependencies
import { Routes, Route, useLocation } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";

//pages
import Launch from "./pages/Launch";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import ChooseUsername from "./pages/ChooseUsername";
import Loader from "./pages/Loader";
import { useRef } from "react";

//components
import Navbar from "./pages/components/Navbar";

//css
import "./style.css";

export default function App() {
  const nodeRef = useRef(null);
  const location = useLocation();
  return (
    <TransitionGroup component={null}>
      {/* CSSTransition wraps each route */}
      <CSSTransition key={location.pathname} classNames="pop" timeout={500}>
        <Routes location={location}>
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
      </CSSTransition>
    </TransitionGroup>
  );
}
