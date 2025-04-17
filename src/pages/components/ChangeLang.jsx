import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import React from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import utils from "../../../utils";

const availableLang = [
  { display: "Hindi", value: "hindi", native: "हिन्दी" },
  { display: "English", value: "english", native: "English" },
  { display: "Punjabi", value: "punjabi", native: "ਪੰਜਾਬੀ" },
  { display: "Tamil", value: "tamil", native: "தமிழ்" },
  { display: "Telugu", value: "telugu", native: "తెలుగు" },
  { display: "Marathi", value: "marathi", native: "मराठी" },
  { display: "Gujarati", value: "gujarati", native: "ગુજરાતી" },
  { display: "Bengali", value: "bengali", native: "বাংলা" },
  { display: "Kannada", value: "kannada", native: "ಕನ್ನಡ" },
  { display: "Bhojpuri", value: "bhojpuri", native: "भोजपुरी" },
  { display: "Malayalam", value: "malayalam", native: "മലയാളം" },
  { display: "Urdu", value: "urdu", native: "اردو" },
  { display: "Haryanvi", value: "haryanvi", native: "हरियाणवी" },
  { display: "Rajasthani", value: "rajasthani", native: "राजस्थानी" },
  { display: "Odia", value: "odia", native: "ଓଡ଼ିଆ" },
  { display: "Assamese", value: "assamese", native: "অসমীয়া" },
];

export default function ChangeLang() {
  const auth = useContext(AuthContext);
  const [chosen, setChosen] = useState(auth?.user?.languages || []);
  const [showSubmit, setShowSubmit] = useState(false);

  const { openElements, open, close } = useContext(HashContext);

  const toggleLang = (lang) => {
    setChosen((prev) => {
      return prev.includes(lang)
        ? prev.filter((l) => l != lang)
        : [lang, ...prev];
    });
  };

  useEffect(() => {
    setChosen(auth?.user?.languages || []);
  }, [auth]);

  useEffect(() => {
    if (!auth?.user || !chosen) return;
    const authLangString = auth.user.languages.sort().join(",");
    const chosenLangString = chosen.sort().join(",");
    setShowSubmit(authLangString != chosenLangString);
  }, [chosen, auth]);

  const submitLang = async () => {
    close("languages");
    if (chosen.length == 0) return;

    const response = await utils.BACKEND("/add_language", "POST", {
      lang: chosen,
    });
    if (response.status && response.updated) {
      localStorage.removeItem("homeCache");
      auth?.authentication();
    }
  };
  return (
    <OffCanvas
      open={openElements.includes("languages")}
      dismiss={() => close("languages")}
    >
      <p className="text-white text-center">Choose languages for your music</p>
      <hr className="dividerLine" />
      {availableLang.map((item, index) => {
        return (
          <div
            className="playlistSong mt-4 px-2 mb-3"
            style={{ gridTemplateColumns: "40px auto" }}
            key={"lang-" + index}
          >
            <button
              className="iconButton"
              onClick={() => toggleLang(item.value)}
            >
              {chosen.includes(item.value) ? (
                <CheckBox className="profileIcon text-wheat" />
              ) : (
                <CheckBoxOutlineBlank className="profileIcon" />
              )}
            </button>

            <div onClick={() => toggleLang(item.value)}>
              <p className="thinOneLineText playlistSongTitle fw-normal">
                {item.display}
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                {item.native}
              </p>
            </div>
          </div>
        );
      })}
      <div style={{ height: "110px" }}></div>
      {showSubmit && (
        <div
          className="position-fixed bottom-0 left-0 w-100 pb-3 text-center"
          style={{ background: "#1f1f1f" }}
        >
          <button className="addToBut mb-2" onClick={() => submitLang()}>
            Save changes
          </button>
          <i className="text-white-50 fw-light">
            {chosen.length} language selected
          </i>
        </div>
      )}
    </OffCanvas>
  );
}
