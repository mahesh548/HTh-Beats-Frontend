import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreatePlaylist from "./components/CreatePlaylist";

export default function Artist() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);

  useEffect(() => {
    setplaylistData(false);
    const getArtist = async () => {
      const response = await utils.API(`/artist?id=${id}`, "GET");

      /* if (response.hasOwnProperty("list")) {
        setplaylistData(refineResponse(response, url));
      } */
    };
    if (auth.user?.verified) {
      getArtist();
    }
  }, [auth.user, id]);

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreatePlaylist response={playlistData} />
  );
}
