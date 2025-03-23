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
  const [bg, setBg] = useState("#8d8d8d");

  if (!token) {
    //send to /home if token not provided
    navigate("/home");
  }

  useEffect(() => {
    //setting background gradient
    const setColor = async () => {
      const color = await utils.getAverageColor(playlistData.image);

      setBg(color ? color : "#8d8d8d");
    };
    if (playlistData.image) {
      setColor();
    }
  }, [playlistData]);

  const getCollab = async (addMe) => {
    //addMe is false to get image,title and true to add user
    const collabData = {
      token: token,
      collab: addMe,
    };
    const response = await utils.BACKEND("/collab", "POST", {
      collabData: collabData,
    });

    if (response.status) {
      if (response.role == "member") {
        //when user is member send him/her to playlist
        navigate(`/playlist/${response.playlistId}`);
      }
      if (response.role == "viewer") {
        //if user is viewing the collab before joining
        if (playlistData.image == "Playlist.png") {
          // create complete link for default cover
          response.image = `https://${location.host}/Playlist.png`;
        }
        //set the image and title for viewing of user
        setPlaylistData({ image: response.image, title: response.title });
      }
    } else {
      // if playlist or library not found set playlistData to unavailable
      setPlaylistData("unavailable");
    }
  };

  useEffect(() => {
    if (auth.user?.verified) {
      // get image and title if user is logged in
      getCollab(false);
    }
  }, [auth.user, token]);

  const CreateCollab = ({ data }) => {
    return (
      <div className="page hiddenScrollbar">
        <div
          className="backgroundGradient position-absolute"
          style={{ backgroundColor: bg }}
        ></div>
        <div className="editCont hiddenScrollbar">
          <div className="mt-5">
            <img
              src={data.image}
              style={{ height: "150px", width: "150px" }}
              className="d-block m-auto"
            />
            <p className="labelText text-center">{data.title}</p>
          </div>
          <div className="mt-4">
            <p className="text-center text-white-50">
              You are invited to join this collab playlist.
            </p>
            <button className="addToBut" onClick={() => getCollab(true)}>
              Join collab playlist
            </button>
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
