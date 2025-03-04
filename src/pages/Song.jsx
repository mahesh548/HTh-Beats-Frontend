import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateSong from "./components/CreateSong";

export default function Song() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);

  const refineResponse = (response) => {
    response.image.replace("150x150.jpg", "500x500.jpg");
    return response;
  };

  useEffect(() => {
    setplaylistData(false);
    const getSong = async () => {
      const response = await utils.API(`/song?id=${id}`, "GET");

      if (response.hasOwnProperty("more_info")) {
        setplaylistData(refineResponse(response));
      }
    };
    if (auth.user?.verified) {
      getSong();
    }
  }, [auth.user, id]);

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreateSong response={playlistData} />
  );
}
