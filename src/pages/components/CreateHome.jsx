import { useContext } from "react";
import { AuthContext } from "./Auth";
import TimelineSlider from "./TimelineSlider";
import TimelineSquare from "./TimelineSquare";
export default function CreateHome() {
  const auth = useContext(AuthContext);
  const {
    charts,
    city_mod,
    radio,
    tag_mixes,
    artist_recos,
    new_albums,
    new_trending,
  } = JSON.parse(localStorage.homeCache);
  return (
    <div
      className="page hiddenScrollbar"
      style={{ overflowY: "scroll", paddingBottom: "100px" }}
    >
      <h1 className="homeHeading">Welcome {auth.user?.username}</h1>
      {charts && (
        <TimelineSlider label="Try these playlists">
          {charts.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}
      {new_albums && (
        <TimelineSlider label="Today's hits">
          {new_albums.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}

      {tag_mixes && (
        <TimelineSlider label="Lets mix things up">
          {tag_mixes.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}
      {new_trending && (
        <TimelineSlider label="Trending playlist">
          {new_trending.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}
      {radio && (
        <TimelineSlider label="Featured radio stations">
          {radio.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}
      {city_mod && (
        <TimelineSlider label="Fresh new music">
          {city_mod.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style={type == "artist" ? "round" : ""}
              />
            );
          })}
        </TimelineSlider>
      )}
      {artist_recos && (
        <TimelineSlider label="Artist you may like">
          {artist_recos.map((item) => {
            const { id, image, title, type, perma_url } = item;
            const perma_id = perma_url.split("/").pop();

            return (
              <TimelineSquare
                key={id}
                img={image}
                text={title}
                type={type}
                id={perma_id}
                style="round"
              />
            );
          })}
        </TimelineSlider>
      )}
    </div>
  );
}
