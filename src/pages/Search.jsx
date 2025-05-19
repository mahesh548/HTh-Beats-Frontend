import { useContext, useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";
import { AuthContext } from "./components/Auth";

import CreateSearch from "./components/CreateSearch";
import DeskSearch from "./components/DeskSearch";

export default function Search() {
  const auth = useContext(AuthContext);

  const [searchData, setSearchData] = useState(false);

  useEffect(() => {
    setSearchData(true);
  }, [auth.user]);

  const isDesktop = window.innerWidth >= 1000;

  return searchData == false ? (
    <PageLoader />
  ) : !isDesktop ? (
    <CreateSearch />
  ) : (
    <DeskSearch />
  );
}
