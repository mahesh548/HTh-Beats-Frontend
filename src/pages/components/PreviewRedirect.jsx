import { useEffect } from "react";

import PageLoader from "./PageLoader";
import { useLocation, useNavigate } from "react-router";

function PreviewRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const id = params.get("id");

    if (type && id) {
      navigate(`/${type}/${id}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return <PageLoader />;
}

export default PreviewRedirect;
