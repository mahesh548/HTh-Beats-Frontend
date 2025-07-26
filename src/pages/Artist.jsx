import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateArtist from "./components/CreateArtist";
import PlaylistNotFound from "./components/PlaylistNotFound";

export default function Artist() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);

  const refineResponse = (response) => {
    response.image = response.image.replace("150x150.jpg", "500x500.jpg");
    response.list = response.topSongs;
    response.id = response.artistId;
    response.bio = JSON.parse(response?.bio || "[]");
    response.subtitle_desc = response?.subtitle
      ? `${response.subtitle}`
      : `Artist • ${data?.follower_count || data?.fan_count} Followers`;

    delete response.artistId;
    delete response.topSongs;
    return response;
  };

  useEffect(() => {
    setplaylistData(false);
    const getArtist = async () => {
      const response = await utils.API(`/artist?id=${id}`, "GET");

      if (response.hasOwnProperty("topSongs")) {
        setplaylistData(refineResponse(response));
      }
    };
    if (auth.user?.verified) {
      getArtist();
    }
  }, [auth.user, id]);

  if (
    playlistData !== false &&
    playlistData?.list &&
    playlistData?.list?.length == 0
  ) {
    return <PlaylistNotFound />;
  }

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreateArtist response={playlistData} />
  );
}
