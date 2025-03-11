import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
export default function Library() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [LibraryData, setLibraryData] = useState(false);

  const refineResponse = (response) => {
    return response;
  };

  useEffect(() => {
    setLibraryData(false);
    const getLibraryData = async () => {
      const response = await utils.BACKEND("/save", "GET");
      if (response.hasOwnProperty("data") && response.data.length > 0) {
        setLibraryData(refineResponse(response));
      }
    };
    if (auth.user?.verified) {
      getLibraryData();
    }
  }, [auth.user, id]);

  return LibraryData == false ? <PageLoader /> : <></>;
}
