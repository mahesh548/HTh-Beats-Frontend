import { useContext, useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";
import { AuthContext } from "./components/Auth";

import CreateSearch from "./components/CreateSearch";

export default function Search() {
  const auth = useContext(AuthContext);

  const [searchData, setSearchData] = useState(false);

  useEffect(() => {
    setSearchData(true);
  }, [auth.user]);

  return searchData == false ? <PageLoader /> : <CreateSearch />;
}
