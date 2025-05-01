import { lazy, Suspense, useEffect, useState } from "react";
import PageLoader from "./pages/components/PageLoader";
import "./style.css";
const Desktop = lazy(() => import("./Desktop"));
const App = lazy(() => import("./App"));

export default function Root() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 380);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="page" style={{ paddingTop: "150px" }}>
          <PageLoader />
        </div>
      }
    >
      {isDesktop ? <Desktop /> : <App />}
    </Suspense>
  );
}
