import { useContext, useEffect, useRef, useState } from "react";
import BackButton from "./components/BackButton";
import { AuthContext } from "./components/Auth";
import {
  DeleteOutline,
  Edit,
  EqualizerOutlined,
  InfoOutlined,
  ManageAccountsOutlined,
  RadioButtonChecked,
  RadioButtonUncheckedOutlined,
  ShieldOutlined,
  TranslateOutlined,
  Upload,
} from "@mui/icons-material";
import React from "react";
import { HashContext } from "./components/Hash";
import OffCanvas from "./components/BottomSheet";
import utils from "../../utils";
import ConfirmPrompt from "./components/ConfirmPrompt";
import { showToast } from "./components/showToast";
import { useNavigate } from "react-router";

const audioQuality = [
  { value: "12", display: "Data saver" },
  { value: "48", display: "Low" },
  { value: "96", display: "Normal" },
  { value: "160", display: "High" },
  { value: "320", display: "Very high" },
];
const alertMessage = {
  search: {
    body: "All of your search history will be deleted.",
    butText: "Clear searches",
    action: "search",
  },
  recent: {
    body: "All the history of songs that you played will be deleted.",
    butText: "Clear recents",
    action: "recent",
  },

  account: {
    body: "Your HTh-Beats account and all of your data will be deleted and can never be recovered.",
    butText: "Delete my account",
    action: "account",
  },
};

export default function Profile() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [currentQ, setCurrentQ] = useState(
    localStorage.getItem("stream_quality") || "96"
  );
  const [currentD, setCurrentD] = useState(
    localStorage.getItem("download_quality") || "96"
  );
  const alertText = useRef(null);
  useEffect(() => {
    localStorage.setItem("stream_quality", currentQ);
    localStorage.setItem("download_quality", currentD);
  }, [currentQ, currentD]);
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
        open("picPreview");
      };

      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };
  const handleFileUpload = async () => {
    close("picPreview");
    close("picOption");
    const formData = new FormData();
    formData.append("image", profileFile);
    const response = await utils.BACKEND("/profile_pic", "POST", formData);
    if (response?.status && response.uploaded) {
      showToast({
        text: "Profile picture updated",
        image: response.url,
        type: "img",
      });
      await auth?.authentication();
    }
  };

  const handleFileDelete = async () => {
    close("picOption");
    const response = await utils.BACKEND("/profile_pic", "DELETE");
    if (response?.status && response.deleted) {
      showToast({ text: "Profile picture removed" });
      await auth?.authentication();
    }
  };
  const openPS = () => {
    document.getElementById("picSelector").click();
  };
  const openAlert = async (type) => {
    alertText.current = alertMessage[type];
    closeOpen("manageAccount", "deleteConfirm");
  };

  const deleteThis = async (type) => {
    if (type == "search") {
      await utils.BACKEND(`/activity`, "DELETE", {
        deleteData: { historyIds: ["all"], type: "search", idList: ["all"] },
      });
      showToast({ text: "Search history deleted" });
    }
    if (type == "recent") {
      await utils.BACKEND(`/activity`, "DELETE", {
        deleteData: { historyIds: ["all"], type: "history" },
      });
      showToast({ text: "Deleted recent play" });
    }
    if (type == "account") {
      const result = await utils.BACKEND(`/account`, "DELETE");
      if (result.status && result.delete) {
        utils.Logout();
      }
    }
  };

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`HTh Beats - ${auth?.user?.username}`);
    }
  }

  return (
    <div className="page">
      <div className="profilePage">
        <div className="libraryNavCont mobo">
          <div className="libraryNav">
            <BackButton />
            <p className="text-center text-white fw-light fs-4">
              Profile & settings
            </p>
          </div>
        </div>
        <div className="profileCont">
          <div
            className="playlistSong mt-3 px-2 mb-3 profileHeader"
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

            <button className="iconButton" onClick={() => open("picOption")}>
              <Edit />
            </button>
          </div>

          <hr className="dividerLine" />
          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <TranslateOutlined className="profileIcon" />
            <div onClick={() => open("languages")}>
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
            <div onClick={() => open("audioQuality")}>
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
            <div onClick={() => open("manageAccount")}>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Manage your account and data
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                Manage your account data and history • Delete your account.
              </p>
            </div>
          </div>
          {auth?.user?.role == "admin" && (
            <div
              className="playlistSong mt-4 px-2 mb-3"
              style={{ gridTemplateColumns: "40px auto" }}
            >
              <ShieldOutlined className="profileIcon" />
              <div onClick={() => navigate("/admin")}>
                <p className="thinOneLineText playlistSongTitle fw-normal">
                  Admin panel
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  Manage users and their data • Manage download permissions.
                </p>
              </div>
            </div>
          )}

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

          <button
            className="addToBut p-2 px-3 mt-4"
            onClick={() => utils.Logout()}
          >
            Log out
          </button>
        </div>
        <OffCanvas
          open={openElements.includes("picPreview")}
          dismiss={() => close("picPreview")}
        >
          <div className="contextCont">
            <p className="text-white text-center">Preview</p>
            <hr className="dividerLine" />
            <img
              src={preview}
              id="previewPic"
              className="d-block m-auto w-50 rounded rounded-circle"
            />
            <button
              className="addToBut mt-4"
              onClick={() => handleFileUpload()}
            >
              Set as profile pic
            </button>
            <button
              className="iconButton mt-3 text-center d-block m-auto"
              onClick={() => close("picPreview")}
            >
              Cancel
            </button>
          </div>
        </OffCanvas>
        <OffCanvas
          open={openElements.includes("picOption")}
          dismiss={() => close("picOption")}
        >
          <p className="text-white text-center">Change or remove profile pic</p>
          <hr className="dividerLine" />
          <input
            type="file"
            style={{ display: "none" }}
            id="picSelector"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          />
          <div
            className="playlistSong mt-4 px-2 mb-3 cursor-pointer"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <Upload className="profileIcon" onClick={() => openPS()} />
            <div onClick={() => openPS()}>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Upload a new profile picture
              </p>
            </div>
          </div>
          <div
            className="playlistSong mt-4 px-2 mb-3 cursor-pointer"
            style={{ gridTemplateColumns: "40px auto" }}
          >
            <DeleteOutline
              className="profileIcon"
              onClick={() => handleFileDelete()}
            />
            <div onClick={() => handleFileDelete()}>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                Delete current profile picture
              </p>
            </div>
          </div>
        </OffCanvas>
        <OffCanvas
          open={openElements.includes("audioQuality")}
          dismiss={() => close("audioQuality")}
        >
          <div className="contextCont">
            <p className="text-white text-center">Media quality</p>
            <hr className="dividerLine" />

            <p className="labelText ps-2 fw-light">Audio streaming quality</p>
            <p className="playlistSongSubTitle text-white-50 fw-light ps-2">
              Choose the quality of your audio streaming when you're connected
              to internet.
            </p>

            {audioQuality.map((item, index) => {
              return (
                <div
                  className="playlistSong mt-4 px-2 mb-3"
                  style={{ gridTemplateColumns: " auto 40px" }}
                  key={"quality-" + index}
                >
                  <div onClick={() => setCurrentQ(item.value)}>
                    <p className="thinOneLineText playlistSongTitle fw-normal">
                      {item.display}
                    </p>
                  </div>
                  <button
                    className="iconButton"
                    onClick={() => setCurrentQ(item.value)}
                  >
                    {currentQ == item.value ? (
                      <RadioButtonChecked className="profileIcon text-wheat" />
                    ) : (
                      <RadioButtonUncheckedOutlined className="profileIcon" />
                    )}
                  </button>
                </div>
              );
            })}
            <p className="labelText ps-2 fw-light mt-5">
              Audio download quality
            </p>
            <p className="playlistSongSubTitle text-white-50 fw-light ps-2">
              Choose the quality of all your audio downloads.
            </p>

            {audioQuality.map((item, index) => {
              return (
                <div
                  className="playlistSong mt-4 px-2 mb-3"
                  style={{ gridTemplateColumns: " auto 40px" }}
                  key={"download-quality-" + index}
                >
                  <div onClick={() => setCurrentD(item.value)}>
                    <p className="thinOneLineText playlistSongTitle fw-normal">
                      {item.display}
                    </p>
                  </div>
                  <button
                    className="iconButton"
                    onClick={() => setCurrentD(item.value)}
                  >
                    {currentD == item.value ? (
                      <RadioButtonChecked className="profileIcon text-wheat" />
                    ) : (
                      <RadioButtonUncheckedOutlined className="profileIcon" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </OffCanvas>
        <OffCanvas
          open={openElements.includes("manageAccount")}
          dismiss={() => close("manageAccount")}
        >
          <p className="text-white text-center">Manage account & data</p>
          <hr className="dividerLine" />
          <i
            className="text-white-50 text-center d-block px-2"
            style={{ fontSize: "14px" }}
          >
            Anything that you delete here will be removed forever and can not be
            recover once deleted.
          </i>
          <button
            className="iconButton text-start mt-4"
            onClick={() => openAlert("search")}
          >
            <p className="labelText ps-2 fw-light mt-2 text-danger">
              Clear search history
            </p>
            <p className="thinThreeLineText mt-1 ps-2">
              Delete all of your search history at once for always.
            </p>
          </button>
          <button
            className="iconButton text-start mt-4"
            onClick={() => openAlert("recent")}
          >
            <p className="labelText ps-2 fw-light mt-2 text-danger">
              Delete recent play
            </p>
            <p className="thinThreeLineText mt-1 ps-2">
              Clear all the recently played song history.
            </p>
          </button>
          <button
            className="iconButton text-start mt-4"
            onClick={() => openAlert("account")}
          >
            <p className="labelText ps-2 fw-light mt-2 text-danger">
              Delete account
            </p>
            <p className="thinThreeLineText mt-1 ps-2">
              If you want to delete everything at once then delete your account.
              you can not recover your account once deleted.
            </p>
          </button>
        </OffCanvas>
        <ConfirmPrompt
          id="deleteConfirm"
          body={alertText.current?.body}
          butText={alertText.current?.butText}
          onConfirm={() => deleteThis(alertText.current?.action)}
        />
      </div>
    </div>
  );
}
