import { useContext } from "react";
import { AuthContext } from "./Auth";
import TimelineSlider from "./TimelineSlider";
import TimelineSquare from "./TimelineSquare";
export default function CreateHome() {
  const auth = useContext(AuthContext);
  const { browse_discover, charts, city_mod, radio, tag_mixes } = JSON.parse(
    localStorage.homeCache
  );
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
              />
            );
          })}
        </TimelineSlider>
      )}
    </div>
  );
}
