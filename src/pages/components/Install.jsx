import { useContext, useEffect, useState } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import BackButton from "./BackButton";

export default function Install() {
  const { openElements, open, close } = useContext(HashContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      open("Install");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setDeferredPrompt(null);
    close("Install");
  };

  return (
    <OffCanvas
      open={openElements.includes("Install")}
      dismiss={() => dismiss()}
    >
      <div>
        <BackButton styleClass="iconButton mt-0 " />
        <hr className="dividerLine opacity-0" />
        <div
          className="playlistSong px-3 mb-4 mt-4"
          style={{ gridTemplateColumns: "50px auto max-content" }}
        >
          <img src="logo.png" alt="Logo" className="playlistSongImg" />
          <div className="">
            <p className="thinOneLineText playlistSongTitle">
              Hertz To hearts - Beats
            </p>
            <p className="thinOneLineText playlistSongSubTitle">
              Download size ~ 1MB
            </p>
          </div>

          <button
            className="iconButton addToBut px-3 py-2 "
            onClick={() => handleInstallClick()}
          >
            Install
          </button>
        </div>
        <hr className="dividerLine" />
        <p className="text-white-50 fs-6 text-start ps-2 fw-light py-2">
          Install HTh-Beats for faster and easier access to your favorite
          musics.
        </p>
        <div className="sliderContainer screenshots hiddenScrollbar px-2">
          <img src="screenshot1.png" alt="screen shot" />
          <img src="screenshot2.png" alt="screen shot" />
          <img src="screenshot3.png" alt="screen shot" />
          <img src="screenshot4.png" alt="screen shot" />
          <img src="screenshot5.png" alt="screen shot" />
          <img src="screenshot6.png" alt="screen shot" />
        </div>
      </div>
    </OffCanvas>
  );
}
