import { useContext, useEffect, useState } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";

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

  const dimiss = () => {
    setDeferredPrompt(null);
    close("Install");
  };

  return (
    <OffCanvas open={openElements.includes("Install")} dismiss={() => dimiss()}>
      <div>
        <div
          className="playlistSong px-3 mb-3"
          style={{ gridTemplateColumns: "50px auto max-content" }}
        >
          <img src="logo.png" alt="Logo" className="playlistSongImg" />
          <div className="">
            <p className="thinOneLineText playlistSongTitle">
              Hertz To hearts - Beats
            </p>
            <p className="thinOneLineText playlistSongSubTitle">~ 1MB</p>
          </div>

          <button
            className="addToBut px-3 py-2"
            onClick={() => handleInstallClick()}
          >
            Install
          </button>
        </div>
        <hr className="dividerLine" />
      </div>
    </OffCanvas>
  );
}
