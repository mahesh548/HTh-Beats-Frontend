import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";

import PlaylistNotFound from "./components/PlaylistNotFound";

export default function Collab() {
  const auth = useContext(AuthContext);
  const { token } = useParams();
  const [playlistData, setPlaylistData] = useState(false);
  const navigate = useNavigate();

  if (!token) {
    /* navigate("/home"); */
    console.log(token);
  }

  useEffect(() => {
    const getCollab = async () => {
      const collabData = {
        token: token,
        collab: false,
      };
      const response = await utils.BACKEND("/collab", "POST", {
        collabData: collabData,
      });

      if (response.status) {
        if (response.role == "member") {
          navigate(`/playlist/${response.playlistId}`);
        }
        if (response.role == "viewer") {
          setPlaylistData({ image: response.image, title: response.title });
        }
      } else {
        setPlaylistData("unavailable");
      }
    };
    if (auth.user?.verified) {
      getCollab();
    }
  }, [auth.user, token]);

  const CreateCollab = (data) => {
    return (
      <div className="page hiddenScrollbar">
        <div className="collabCont">
          <div>
            <img src={data.image} />
            <p>{data.title}</p>
          </div>
          <div>
            <button className="addToBut">Join collab</button>
            <p>You are invited to join this collab playlist.</p>
          </div>
        </div>
      </div>
    );
  };

  return playlistData == false ? (
    <PageLoader />
  ) : playlistData === "unavailable" ? (
    <PlaylistNotFound />
  ) : (
    <CreateCollab data={playlistData} />
  );
}
