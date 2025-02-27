import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateArtist from "./components/CreateArtist";

export default function Artist() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);

  const refineResponse = (response) => {
    response.list = response.topSongs;
    response.id = response.artistId;
    response.bio = JSON.parse(response?.bio || "[]");
    response.header_desc = response?.bio[0]?.text || response.name;
    response.subtitle_desc = response?.subtitle
      ? `${response.subtitle}`
      : `Artist • ${data?.follower_count || data?.fan_count} Followers`;
    response.title = response.name;

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

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreateArtist response={playlistData} />
  );
}
