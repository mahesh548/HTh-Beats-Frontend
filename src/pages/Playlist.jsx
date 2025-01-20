import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";

export default function playlist() {
  const { id } = useParams();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const getPlaylist = async () => {
      const response = await utils.API(`/entity/playlist?id=${id}`, "GET");
      console.log(response);
      if (response.hasOwnProperty("list")) {
        setLoader(false);
      }
    };
    getPlaylist();
  }, []);
  const CreatePlaylist = () => {
    return <h1>hello</h1>;
  };

  return loader ? <PageLoader /> : <CreatePlaylist />;
}
