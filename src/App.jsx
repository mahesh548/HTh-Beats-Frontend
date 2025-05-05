//dependencies
import { Routes, Route } from "react-router";
//pages
import Launch from "./pages/Launch";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Playlist from "./pages/Playlist";
import ChooseUsername from "./pages/ChooseUsername";
import Loader from "./pages/Loader";
import Search from "./pages/Search";
import Artist from "./pages/Artist";
import Song from "./pages/Song";
import Collab from "./pages/Collab";
import Library from "./pages/Library";

//components
import Navbar from "./pages/components/Navbar";
import Install from "./pages/components/Install";

//css

import History from "./pages/History";
import Join from "./pages/Join";
import Room from "./pages/Room";
import Profile from "./pages/Profile";
/* import { Toaster } from "sonner"; */
import PlaylistNotFound from "./pages/components/PlaylistNotFound";

export default function App() {
  return (
    <>
      {/* <Toaster /> */}
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/history" element={<History />} />
          <Route path="/collab/:token" element={<Collab />} />
          <Route path="/join/:id" element={<Join />} />
          <Route path="/room" element={<Room />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/album/:id" element={<Playlist />} />
          <Route path="/song/:id" element={<Song />} />
          <Route path="/mix/:id" element={<Playlist />} />
          <Route path="/artist/:id" element={<Artist />} />
        </Route>

        {/* ERROR PAGES */}
        <Route path="*" element={<PlaylistNotFound />} />
      </Routes>
    </>
  );
}
