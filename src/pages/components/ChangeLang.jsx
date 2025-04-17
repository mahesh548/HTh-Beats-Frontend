import { useContext, useState } from "react";
import { AuthContext } from "./Auth";
import { CheckBoxOutlineBlank } from "@mui/icons-material";
import React from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";

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

  const { openElements, open, close } = useContext(HashContext);

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
            <CheckBoxOutlineBlank className="profileIcon" />
            <div>
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
    </OffCanvas>
  );
}
