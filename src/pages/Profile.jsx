import { useContext } from "react";
import BackButton from "./components/BackButton";
import { AuthContext } from "./components/Auth";
import {
  CameraAltOutlined,
  EqualizerOutlined,
  InfoOutlined,
  LanguageOutlined,
  ManageAccountsOutlined,
  TranslateOutlined,
} from "@mui/icons-material";

export default function Profile() {
  const auth = useContext(AuthContext);
  return (
    <div className="page">
      <div className="profilePage">
        <div className="libraryNavCont">
          <div className="libraryNav">
            <BackButton />
            <p className="text-center text-white fw-light fs-4">
              Profile & settings
            </p>
          </div>
        </div>
        <div className="profileCont">
          <div
            className="playlistSong mt-3 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto 40px" }}
          >
            <img
              src={auth?.user?.pic}
              className="playlistSongImg rounded-circle"
              style={{ height: "40px", width: "40px" }}
            />
            <div>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                {auth?.user?.username}
              </p>
            </div>

            <button className="iconButton">
              <CameraAltOutlined />
            </button>
          </div>

          <hr className="dividerLine" />
          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <TranslateOutlined className="profileIcon" />
            <div>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Languages for music
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                Set your preferred languages for music.
              </p>
            </div>
          </div>

          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <EqualizerOutlined className="profileIcon" />
            <div>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Audio streaming quality
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                Choose the quality of your audio streaming and downloading.
              </p>
            </div>
          </div>

          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <ManageAccountsOutlined className="profileIcon" />
            <div>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Manage your data
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                Manage your account data and history or delete your account.
              </p>
            </div>
          </div>

          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <InfoOutlined className="profileIcon" />
            <div>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                About
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                Learn more about HTh Beats and how its made.
              </p>
            </div>
          </div>

          <button className="addToBut p-2 px-3 mt-4">Log out</button>
        </div>
      </div>
    </div>
  );
}
