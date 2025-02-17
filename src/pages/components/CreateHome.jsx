import TimelineSlider from "./TimelineSlider";
import TimelinePromo from "./TimelinePromo";

export default function CreateHome() {
  const homeCache = JSON.parse(localStorage.homeCache);
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

  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      {charts && <TimelineSlider label="Try these playlists" data={charts} />}
      {new_albums && (
        <TimelineSlider label="Today's biggest hits" data={new_albums} />
      )}

      {tag_mixes && (
        <TimelineSlider label="Lets mix things up" data={tag_mixes} />
      )}
      {new_trending && (
        <TimelineSlider label="Trending right now" data={new_trending} />
      )}
      {radio && <TimelineSlider label="Featured radio stations" data={radio} />}
      {city_mod && <TimelineSlider label="Fresh new music" data={city_mod} />}
      {top_playlists && (
        <TimelineSlider label="Most played playlists" data={top_playlists} />
      )}
      {artist_recos && (
        <TimelineSlider
          label="Artist you may like"
          data={artist_recos}
          style="round"
        />
      )}
      <div style={{ height: "40px" }}></div>
      {promo && <TimelinePromo promo={promo} />}
    </div>
  );
}
