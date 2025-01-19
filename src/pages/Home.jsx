import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./components/Auth";
import utils from "../../utils";
import PageLoader from "./components/PageLoader";
import CreateHome from "./components/CreateHome";
export default function Home() {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getHome = async () => {
      const response = await utils.API(`/home`, "GET");

      if (
        response?.data?.hasOwnProperty("browse_discover") ||
        response?.data?.hasOwnProperty("global_config") ||
        response?.data?.hasOwnProperty("charts")
      ) {
        response.data.createdAt = Date.now();
        localStorage.setItem("homeCache", JSON.stringify(response.data));
        setLoading(false);
      }
    };

    //check if homeCache is existed and created less than 24 hrs ago
    const isCache = () => {
      if (
        localStorage.homeCache &&
        utils.dura(JSON.parse(localStorage.homeCache).createdAt).hrs < 24
      ) {
        return true;
      } else {
        return false;
      }
    };
    //if home cache is created less than 24 hrs ago then:
    if (auth.user?.languages) {
      if (!isCache()) {
        getHome();
      } else {
        setLoading(false);
      }
    }
  }, [auth.user]);

  return <>{loading ? <PageLoader /> : <CreateHome />}</>;
}
