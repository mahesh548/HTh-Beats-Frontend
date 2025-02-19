import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreatePlaylist from "./components/CreatePlaylist";

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
        response?.year || "",
        `${response.list_count} songs`,
      ];
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
      }
    };
    if (auth.user?.verified) {
      getPlaylist();
    }
  }, [auth.user, id]);

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreatePlaylist response={playlistData} />
  );
}
