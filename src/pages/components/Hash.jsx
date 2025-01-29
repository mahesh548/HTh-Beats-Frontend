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
    console.log("params changes");
  }, [location.search]);

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
      /*  const newOpenElements = [...openElements];
      newOpenElements.splice(newOpenElements.indexOf(id), 1);
      const url =
        newOpenElements.length == 0
          ? location.pathname
          : `${location.pathname}?open=${newOpenElements.join("&open=")}`;
      navigate(url, { replace: true }); */
      navigate(-1);
    }
  };
  return (
    <HashContext.Provider value={{ openElements, open, close }}>
      {children}
    </HashContext.Provider>
  );
}
