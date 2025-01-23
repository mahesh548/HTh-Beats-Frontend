import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Auth from "./pages/components/Auth.jsx";
import App from "./App.jsx";
import SongWrap from "./pages/components/Song.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Auth>
      <SongWrap>
        <App />
      </SongWrap>
    </Auth>
  </BrowserRouter>
);
