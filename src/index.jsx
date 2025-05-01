import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Auth from "./pages/components/Auth.jsx";
import SongWrap from "./pages/components/Song.jsx";
import HashProvider from "./pages/components/Hash.jsx";
import ChannelProvider from "./pages/components/Channel.jsx";
import Root from "./Root.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HashProvider>
      <Auth>
        <ChannelProvider>
          <SongWrap>
            <Root />
          </SongWrap>
        </ChannelProvider>
      </Auth>
    </HashProvider>
  </BrowserRouter>
);
