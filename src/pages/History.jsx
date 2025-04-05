import { useContext, useEffect, useRef, useState } from "react";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateHistory from "./components/CreateHistory";
export default function History() {
  const auth = useContext(AuthContext);
  const [HistoryData, setHistoryData] = useState(false);
  const [originalResponse, setOriginalResponse] = useState(false);
  const [filterData, setFilterData] = useState({});
  const callAgain = useRef(false);
  const filterActive = useRef(false);

  const idealFilterData = [
    { value: "played", parent: "all", label: "Played" },
    { value: "saved", parent: "all", label: "Saved" },
    { value: "created", parent: "all", label: "Created" },
    { value: "joined", parent: "all", label: "Joined" },
    { value: "search", parent: "all", label: "Searched" },
  ];
  const refineResponse = (response) => {
    let newResponse = response
      .map((item) => {
        const originalType = item.type;
        const { _id } = item;
        item.entityType = originalType;
        if (item.type == "search") {
          item.data = {
            title: "Search",
            image: `https://${window.location.host}/Search.png`,
          };
        }
        let newItem = { ...item, ...item.data, _id: _id };

        delete newItem.data;
        return newItem;
      })
      .filter((item) => !item.data)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    let newFilterData = [];
    idealFilterData.forEach((item) => {
      if (newResponse.some((response) => response.activity == item.value)) {
        newFilterData.push(item);
      }
    });
    setFilterData(newFilterData);

    return newResponse;
  };

  const filter = (value) => {
    if (value == "all") {
      filterActive.current = false;
      setHistoryData(refineResponse(originalResponse.data));
    } else {
      filterActive.current = true;
      setHistoryData(
        refineResponse(originalResponse.data).filter(
          (item) => item.activity == value
        )
      );
    }
  };

  const getHistoryData = async (page = 1) => {
    const response = await utils.BACKEND(`/activity?page=${page}`, "GET");
    if (response?.data && response.data.length > 0 && response.page == 1) {
      setOriginalResponse(response);
      setHistoryData(refineResponse(response.data));
      callAgain.current = response.hasMore; // set call again to hasMore (true,false) for more result
    } else if (
      response?.data &&
      response.data.length > 0 &&
      response.page > 1
    ) {
      setOriginalResponse({
        ...response,
        data: [...originalResponse.data, ...response.data],
      });
      setHistoryData([...HistoryData, ...refineResponse(response.data)]);
      callAgain.current = response.hasMore; // set call again to hasMore (true,false) for more result
    }
  };

  useEffect(() => {
    setHistoryData(false);

    if (auth.user?.verified) {
      getHistoryData();
    }
  }, [auth.user]);

  const next = async (reload) => {
    if (reload) {
      callAgain.current = false;
      setHistoryData(false);
      setOriginalResponse(false);
      getHistoryData();
      return;
    }
    if (!callAgain.current) return;
    callAgain.current = false; // set call again to false to avoid multiple calls
    const page = originalResponse.page + 1;
    await getHistoryData(page);
  };

  return HistoryData == false ? (
    <PageLoader />
  ) : (
    <CreateHistory
      response={HistoryData}
      filter={filter}
      filterData={filterData}
      next={next}
      hasMore={originalResponse?.hasMore}
      filterActive={filterActive.current}
    />
  );
}
