import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreatePlaylist from "./components/CreatePlaylist";

export default function playlist() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [playlistData, setplaylistData] = useState(false);
  let response;

  useEffect(() => {
    const getPlaylist = async () => {
      response = await utils.API(`/entity/playlist?id=${id}`, "GET");

      if (response.hasOwnProperty("list")) {
        setplaylistData(response);
      }
    };
    if (auth.user?.verified) {
      getPlaylist();
    }
  }, [auth.user]);

  return playlistData == false ? (
    <PageLoader />
  ) : (
    <CreatePlaylist
      data={playlistData}
      response={response}
      setData={setplaylistData}
    />
  );
}
