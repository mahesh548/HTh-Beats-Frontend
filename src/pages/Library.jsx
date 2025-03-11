import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateLibrary from "./components/CreateLibrary";
export default function Library() {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [LibraryData, setLibraryData] = useState(false);

  const refineResponse = (response) => {
    let newResponse = [
      response.find((item) => item.type == "liked"),
      ...response
        .filter((item) => item.data != null)
        .sort((a, b) => new Date(b.data.updatedAt) - new Date(a.data.updatedAt))
        .filter((item) => item.type != "liked"),
    ].map((item) => {
      item.data.libraryType = item.type;
      item.data.libraryUserId = item.userId;
      return item.data;
    });
    return newResponse;
  };

  useEffect(() => {
    setLibraryData(false);
    const getLibraryData = async () => {
      const response = await utils.BACKEND("/save", "GET");
      if (response.hasOwnProperty("data") && response.data.length > 0) {
        setLibraryData(refineResponse(response.data));
        console.log(refineResponse(response.data));
      }
    };
    if (auth.user?.verified) {
      getLibraryData();
    }
  }, [auth.user, id]);

  return LibraryData == false ? (
    <PageLoader />
  ) : (
    <CreateLibrary response={LibraryData} />
  );
}
