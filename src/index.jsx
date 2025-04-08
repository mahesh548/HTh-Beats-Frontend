import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Auth from "./pages/components/Auth.jsx";
import App from "./App.jsx";
import SongWrap from "./pages/components/Song.jsx";
import HashProvider from "./pages/components/Hash.jsx";
import ChannelProvider from "./pages/components/Channel.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HashProvider>
      <Auth>
        <ChannelProvider>
          <SongWrap>
            <App />
          </SongWrap>
        </ChannelProvider>
      </Auth>
    </HashProvider>
  </BrowserRouter>
);
