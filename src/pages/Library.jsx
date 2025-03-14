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
  const [filterData, setFilterData] = useState({});

  const idealFilterData = [
    { value: "playlist", parent: "all", label: "Playlists" },
    { value: "album", parent: "all", label: "Albums" },
    { value: "mix", parent: "all", label: "Mixes" },
    { value: "artist", parent: "all", label: "Artists" },
    { value: "private", parent: "playlist", label: "By You" },
    { value: "hth", parent: "playlist", label: "By HTh-Beats" },
    { value: "collab", parent: "playlist", label: "Collabs" },
  ];

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
    let newFilterData = [];
    idealFilterData.forEach((item) => {
      if (item.value == "private" || item.value == "collab") {
        if (newResponse.some((response) => response.libraryType == item.value))
          newFilterData.push(item);
        return;
      }
      if (item.value == "hth") {
        if (newResponse.some((response) => !response.hasOwnProperty("userId")))
          newFilterData.push(item);
        return;
      }
      if (newResponse.some((response) => response.type == item.value)) {
        newFilterData.push(item);
      }
    });
    setFilterData(newFilterData);

    return newResponse;
  };
  const filter = (field, value) => {
    if (value == "all") {
      setLibraryData(refineResponse(originalResponse));
    } else {
      setLibraryData(LibraryData.filter((item) => item[field] == value));
    }
  };

  useEffect(() => {
    setLibraryData(false);
    const getLibraryData = async () => {
      const response = await utils.BACKEND("/save", "GET");
      if (response.hasOwnProperty("data") && response.data.length > 0) {
        setOriginalResponse(response.data);
        setLibraryData(refineResponse(response.data));
      }
    };
    if (auth.user?.verified) {
      getLibraryData();
    }
  }, [auth.user, id]);

  return LibraryData == false ? (
    <PageLoader />
  ) : (
    <CreateLibrary
      response={LibraryData}
      filter={filter}
      filterData={filterData}
    />
  );
}
