import TimelineSlider from "./TimelineSlider";
import TimelinePromo from "./TimelinePromo";
import Recent from "./Recent";
import { AuthContext } from "./Auth";
import { useContext } from "react";
import utils from "../../../utils";
import { Link } from "react-router";

import { showToast } from "./showToast";

export default function CreateHome() {
  const auth = useContext(AuthContext);
  const homeCache = JSON.parse(localStorage.homeCache);
  const recent = JSON.parse(localStorage?.recent || "[]");
  const {
    charts,
    city_mod,
    radio,
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

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryNavCont px-2 position-static">
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
      {promo && <TimelinePromo promo={promo} />}
    </div>
  );
}
