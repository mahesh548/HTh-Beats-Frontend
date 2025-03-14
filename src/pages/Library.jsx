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
  const [originalResponse, setOriginalResponse] = useState(false);

  const filter = (field, value) => {
    if (value == "all") {
      setLibraryData(refineResponse(originalResponse));
    } else {
      setLibraryData(LibraryData.filter((item) => item[field] == value));
    }
  };

  const refineResponse = (response) => {
    let newResponse = [
      response.find((item) => item.type == "liked"),
      ...response
        .filter((item) => item.data != null)
        .map((item) => {
          if (item.type != "private" || item.type != "collab") {
            item.data.updatedAt = item?.updatedAt || "";
          }
          return item;
        })
        .sort((a, b) => new Date(b.data.updatedAt) - new Date(a.data.updatedAt))
        .filter((item) => item.type != "liked"),
    ].map((item) => {
      item.data.libraryType = item.type;
      item.data.libraryUserId = item.userId;
      return item.data;
    });
    console.log(newResponse);
    return newResponse;
  };

  useEffect(() => {
    setLibraryData(false);
    const getLibraryData = async () => {
      const response = await utils.BACKEND("/save", "GET");
      if (response.hasOwnProperty("data") && response.data.length > 0) {
        setOriginalResponse(response.data);
        filter("any", "all");
      }
    };
    if (auth.user?.verified) {
      getLibraryData();
    }
  }, [auth.user, id]);

  return LibraryData == false ? (
    <PageLoader />
  ) : (
    <CreateLibrary response={LibraryData} filter={filter} />
  );
}
