import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";

//playlist type
import CreatePlaylist from "./components/CreatePlaylist";
import CreateLikePlaylist from "./components/CreateLikePlaylist";
import PlaylistNotFound from "./components/PlaylistNotFound";
import CreateCustomPlaylist from "./components/CreateCustomPlaylist";

export default function playlist() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);
  const location = useLocation();

  const pathMap = {
    playlist: "/entity/playlist",
    album: "/entity/album",
    mix: "/entity/mix",
  };
  const getUrl = () => {
    const pathname = location.pathname.split("/")[1];
    if (!pathname) return pathMap["playlist"];
    return pathMap[pathname];
  };

  const refineResponse = (response, url) => {
    if (url == pathMap["album"]) {
      response.more_info.artists = response.more_info.artistMap.artists;
      response.more_info.subtitle_desc = [
        "Album",
        response?.year || "",
        `${response.list_count} songs`,
      ];
    }
    if (url == pathMap["mix"]) {
      let allArtist = response.list
        .map((item) => item.more_info.artistMap.artists)
        .flat()
        .filter((item) => item.image);

      response.more_info.artists = [
        ...new Map(allArtist.map((item2) => [item2.id, item2])).values(),
      ];

      response.more_info.subtitle_desc = [
        "Mix",
        response?.year || response.list.find((item) => item?.year).year,
        `${response.list_count} songs`,
      ];
    }
    response.image.replace("150x150.jpg", "500x500.jpg");
    if (response.image == "Like.png" || response.image == "Playlist.png") {
      response.image = `https://${window.location.host}/${response.image}`;
    }
    return response;
  };

  useEffect(() => {
    setplaylistData(false);
    const getPlaylist = async () => {
      const url = getUrl();
      const response = await utils.API(`${url}?id=${id}`, "GET");

      if (response.hasOwnProperty("list")) {
        setplaylistData(refineResponse(response, url));
      } else {
        setplaylistData({ entityType: "unavailable" });
      }
    };
    if (auth.user?.verified) {
      getPlaylist();
    }
  }, [auth.user, id]);

  return playlistData == false ? (
    <PageLoader />
  ) : playlistData.entityType === "entity" ? (
    <CreatePlaylist response={playlistData} />
  ) : playlistData.entityType === "liked" ? (
    <CreateLikePlaylist response={playlistData} />
  ) : playlistData.entityType === "private" ||
    playlistData.entityType === "collab" ? (
    <CreateCustomPlaylist response={playlistData} />
  ) : (
    <PlaylistNotFound />
  );
}
