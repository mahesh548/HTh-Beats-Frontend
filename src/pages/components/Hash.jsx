import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const HashContext = createContext();

export default function HashProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openElements, setOpenElements] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const opens = params.getAll("open");
    setOpenElements(opens);
  }, [location.search]);

  const buildFinalUrl = (newOpenElements) => {
    const originalParams = new URLSearchParams(location.search);

    // Remove existing 'open' params
    [...originalParams.keys()].forEach((key) => {
      if (key === "open") originalParams.delete(key);
    });

    // Add new 'open' params
    newOpenElements.forEach((val) => originalParams.append("open", val));

    const queryString = originalParams.toString();
    return queryString
      ? `${location.pathname}?${queryString}`
      : location.pathname;
  };

  const closeOpen = (closeId, openId) => {
    if (!openElements.includes(openId)) {
      const newOpenElements = [
        ...openElements.filter((item) => item !== closeId),
        openId,
      ];
      navigate(buildFinalUrl(newOpenElements), { replace: false });
    }
  };

  const closeAll = (closeIds) => {
    const newOpenElements = openElements.filter(
      (item) => !closeIds.includes(item)
    );
    const url = buildFinalUrl(newOpenElements);
    if (newOpenElements.length === 0) {
      navigate(location.pathname, { replace: true });
      return;
    }
    navigate(url, { replace: false });
  };

  const open = (id) => {
    if (!openElements.includes(id)) {
      const newOpenElements = [...openElements, id];
      navigate(buildFinalUrl(newOpenElements), { replace: false });
    }
  };

  const close = (id) => {
    if (openElements.includes(id)) {
      const newOpenElements = openElements.filter((item) => item !== id);
      const url = buildFinalUrl(newOpenElements);
      navigate(url, { replace: true });
      history.go(-1);
    }
  };

  return (
    <HashContext.Provider
      value={{ openElements, open, close, closeOpen, closeAll }}
    >
      {children}
    </HashContext.Provider>
  );
}
