import TimelineSlider from "./TimelineSlider";
import TimelinePromo from "./TimelinePromo";
import Recent from "./Recent";
import { AuthContext } from "./Auth";
import { useContext, useState } from "react";
import utils from "../../../utils";
import { Link } from "react-router";
import { Close } from "@mui/icons-material";

export default function CreateHome() {
  const auth = useContext(AuthContext);
  const homeCache = JSON.parse(localStorage.homeCache);
  const recent = JSON.parse(localStorage?.recent || "[]");
  const [installCard, setInstallCard] = useState(
    !window.PWAinstallable ? false : true
  );
  const {
    charts,
    city_mod,
    tag_mixes,
    artist_recos,
    new_albums,
    new_trending,
    top_playlists,
  } = homeCache;

  let promo = {};
  for (const key in homeCache) {
    if (Object.prototype.hasOwnProperty.call(homeCache, key)) {
      const element = homeCache[key];
      if (key.startsWith("promo") && element[0]["type"] != "show") {
        promo[key] = element;
      }
    }
  }
  const greeting = utils.getUserHomeGreeting(auth?.user?.username);

  if (document.getElementById("audio")) {
    if (!document.getElementById("audio").paused) {
      utils.editMeta("", "#000000");
    } else {
      utils.editMeta(`HTh Beats - ${greeting.vibeText}`, "#000000");
    }
  }
  const handleInstallClick = async () => {
    if (window.PWAinstallable) {
      window.PWAinstallable.prompt();
      await window.PWAinstallable.userChoice;
      window.PWAinstallable = null;
    }
  };

  return (
    <div
      className="page hiddenScrollbar deskScroll"
      style={{ overflowY: "scroll" }}
    >
      <div className="libraryNavCont px-2 position-static mobo">
        <div
          className="libraryNav mt-4 mb-3"
          style={{ gridTemplateColumns: "40px auto", columnGap: "15px" }}
        >
          <Link to="/profile">
            <img
              src={auth?.user?.pic || "logo.png"}
              className="rounded-circle"
              style={{ height: "40px", width: "40px" }}
            />
          </Link>

          <div>
            <p className="labelText mt-0 fs-5">{greeting.greeting}</p>
            <p className="fs-6 text-white-50">{greeting.vibeText}</p>
          </div>
        </div>
      </div>
      {installCard && (
        <div
          className="installCard p-2 mb-3"
          id="installCard"
          style={{ backgroundColor: "pink" }}
        >
          <button
            className="iconButton float-end text-black"
            onClick={() => setInstallCard(false)}
          >
            <Close />
          </button>
          <p className="labelText text-black">Install app</p>
          <p className="text-black">
            Install HTh Beats for faster and easier access to your favorite
            musics.
          </p>
          <button
            className="addToBut bg-black text-white px-3 py-2 ms-0"
            onClick={() => handleInstallClick()}
          >
            Install
          </button>
        </div>
      )}
      {recent && recent.length > 0 && <Recent recentData={recent} />}

      {charts && charts.length > 0 && (
        <TimelineSlider label="Try these playlists" data={charts} />
      )}
      {new_albums && new_albums.length > 0 && (
        <TimelineSlider label="Today's biggest hits" data={new_albums} />
      )}

      {tag_mixes && tag_mixes.length > 0 && (
        <TimelineSlider label="Lets mix things up" data={tag_mixes} />
      )}
      {new_trending && new_trending.length > 0 && (
        <TimelineSlider label="Trending right now" data={new_trending} />
      )}

      {city_mod && city_mod.length > 0 && (
        <TimelineSlider label="Fresh new music" data={city_mod} />
      )}
      {top_playlists && top_playlists.length > 0 && (
        <TimelineSlider label="Most played playlists" data={top_playlists} />
      )}
      {artist_recos && artist_recos.length > 0 && (
        <TimelineSlider
          label="Artist you may like"
          data={artist_recos.map((item) => {
            item.type = "artist";
            return item;
          })}
          style="round"
        />
      )}
      <div style={{ height: "40px" }}></div>
      <div className="promoCont">
        {promo && <TimelinePromo promo={promo} />}
      </div>
    </div>
  );
}
