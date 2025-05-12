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
    setOpenElements([...opens]);
  }, [location.search]);

  const closeOpen = (closeId, openId) => {
    if (!openElements.includes(openId)) {
      const newOpenElements = [
        ...openElements.filter((item) => item != closeId),
        openId,
      ];
      const url = `${location.pathname}?open=${newOpenElements.join("&open=")}`;
      navigate(url, { replace: false });
    }
  };
  const closeAll = (closeIds) => {
    const newOpenElements = [
      ...openElements.filter((item) => !closeIds.includes(item)),
    ];
    if (newOpenElements.length == 0) {
      navigate(location.pathname, { replace: true });
      return;
    }
    const url = `${location.pathname}?open=${newOpenElements.join("&open=")}`;
    navigate(url, { replace: false });
  };

  const open = (id) => {
    if (!openElements.includes(id)) {
      const newOpenElements = [...openElements, id];
      const url =
        newOpenElements.length == 0
          ? location.pathname
          : `${location.pathname}?open=${newOpenElements.join("&open=")}`;
      navigate(url, { replace: false });
    }
  };
  const close = (id) => {
    if (openElements.includes(id)) {
      const newOpenElements = [...openElements];
      newOpenElements.splice(newOpenElements.indexOf(id), 1);
      const url =
        newOpenElements.length == 0
          ? location.pathname
          : `${location.pathname}?open=${newOpenElements.join("&open=")}`;
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
