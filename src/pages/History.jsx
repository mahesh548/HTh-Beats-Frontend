import { useContext, useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";
import utils from "../../utils";
import { AuthContext } from "./components/Auth";
import CreateHistory from "./components/CreateHistory";
export default function History() {
  const auth = useContext(AuthContext);
  const [HistoryData, setHistoryData] = useState(false);
  const [originalResponse, setOriginalResponse] = useState(false);
  const [filterData, setFilterData] = useState({});

  const idealFilterData = [
    { value: "played", parent: "all", label: "Played" },
    { value: "saved", parent: "all", label: "Saved" },
    { value: "created", parent: "all", label: "Created" },
    { value: "joined", parent: "all", label: "Joined" },
  ];
  const refineResponse = (response) => {
    let newResponse = response.map((item) => {
      let newItem = { ...item.data, ...item };
      delete newItem.data;
      return newItem;
    });
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
      setHistoryData(refineResponse(originalResponse));
    } else {
      setHistoryData(
        refineResponse(originalResponse).filter((item) => item.type == value)
      );
    }
  };

  useEffect(() => {
    setHistoryData(false);
    const getHistoryData = async () => {
      const response = await utils.BACKEND("/activity", "GET");
      if (response?.data && response.data.length > 0) {
        setOriginalResponse(response.data);
        setHistoryData(refineResponse(response.data));
      }
    };
    if (auth.user?.verified) {
      getHistoryData();
    }
  }, [auth.user]);

  return HistoryData == false ? (
    <PageLoader />
  ) : (
    <CreateHistory
      response={HistoryData}
      filter={filter}
      filterData={filterData}
    />
  );
}
