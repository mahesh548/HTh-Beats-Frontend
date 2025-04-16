import { useContext, useState } from "react";
import BackButton from "./components/BackButton";
import { AuthContext } from "./components/Auth";
import {
  CameraAltOutlined,
  EqualizerOutlined,
  InfoOutlined,
  ManageAccountsOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import React from "react";
import { HashContext } from "./components/Hash";
import OffCanvas from "./components/BottomSheet";

export default function Profile() {
  const auth = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const { openElements, open, close } = useContext(HashContext);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
        open("picPreview");
      };

      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };
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
              <p className="thinOneLineText playlistSongSubTitle">
                {auth?.user?.email} • verified email
              </p>
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              id="picSelector"
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg"
            />

            <button
              className="iconButton"
              onClick={() => document.getElementById("picSelector").click()}
            >
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
                Choose the quality of your audio streaming • Download quality.
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
                Manage your account data and history • Delete your account.
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
                Learn more about HTh Beats • How its made.
              </p>
            </div>
          </div>

          <button className="addToBut p-2 px-3 mt-4">Log out</button>
        </div>
        <OffCanvas
          open={openElements.includes("picPreview")}
          dismiss={() => close("picPreview")}
        >
          <p className="text-white text-center">Preview</p>
          <hr className="dividerLine" />
          <img
            src={preview}
            id="previewPic"
            className="d-block m-auto w-50 rounded rounded-circle"
          />
          <button className="addToBut mt-4">Set as profile pic</button>
          <button
            className="iconButton mt-3 text-center d-block m-auto"
            onClick={() => close("picPreview")}
          >
            Cancel
          </button>
        </OffCanvas>
      </div>
    </div>
  );
}
