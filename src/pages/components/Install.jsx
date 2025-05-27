import { useContext, useEffect, useState } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import BackButton from "./BackButton";
import { useNavigate } from "react-router";

export default function Install() {
  const { openElements, open, close } = useContext(HashContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    window.PWAinstallable = e;
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  const handleInstallClick = async () => {
    if (window.PWAinstallable) {
      window.PWAinstallable.prompt();
      await window.PWAinstallable.userChoice;
      window.PWAinstallable = null;
      close("Install");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const isDesktop = window.innerWidth >= 1000;

  if (isDesktop) {
    return (
      <>
        {openElements.includes("Install") && (
          <div className="deskBack contextMenuPart" onClick={() => goBack()}>
            <div
              className="deskEditCont"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "90%" }}
            >
              <div className="desk-screenshots">
                <img src="pc_screenshot.png" className="pcSS" />
                <div>
                  <p className="labelText ps-2 pb-1 mt-1">
                    Download HTh Beats for windows
                  </p>
                  <p className="text-white-50 fs-6 text-start ps-2 fw-light  ">
                    Install HTh-Beats for faster and easier access to your
                    favorite musics.
                  </p>
                  <ol className="mt-2">
                    <li className="text-white-50 fs-6 text-start ps-2 fw-light">
                      Download songs in high quality for free
                    </li>
                    <li className="text-white-50 fs-6 text-start ps-2 fw-light">
                      Collab with friends using shared playlist
                    </li>
                    <li className="text-white-50 fs-6 text-start ps-2 fw-light">
                      Create music room to listen songs with friends in realtime
                    </li>
                    <li className="text-white-50 fs-6 text-start ps-2 fw-light">
                      Handpicked playlists for you
                    </li>
                    <li className="text-white-50 fs-6 text-start ps-2 fw-light">
                      Audio quality up to 320kbps
                    </li>
                  </ol>
                  <hr className="dividerLine" />
                  <div
                    className="playlistSong px-3 mb-4 mt-4"
                    style={{
                      gridTemplateColumns: "50px auto max-content max-content",
                    }}
                  >
                    <img
                      src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png"
                      alt="Logo"
                      className="playlistSongImg"
                    />
                    <div className="">
                      <p className="thinOneLineText playlistSongTitle">
                        Hertz To hearts - Beats
                      </p>
                      <p className="thinOneLineText playlistSongSubTitle">
                        Download size ~ 1MB
                      </p>
                    </div>

                    <button
                      className="iconButton addToBut borderBut px-3 py-2 "
                      onClick={() => goBack()}
                    >
                      Later
                    </button>
                    <button
                      className="iconButton addToBut px-3 py-2 "
                      onClick={() => handleInstallClick()}
                    >
                      Install
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <></>;
}
