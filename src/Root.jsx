import { lazy, Suspense, useEffect, useState } from "react";
import PageLoader from "./pages/components/PageLoader";
import "./style.css";
import Install from "./pages/components/Install";
const Desktop = lazy(() => import("./Desktop"));
const App = lazy(() => import("./App"));

export default function Root() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1000);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <>
      {/* Uncomment the install component in final stage */}
      {/* <Install /> */}
      <Suspense
        fallback={
          <div className="page" style={{ paddingTop: "150px" }}>
            <PageLoader />
          </div>
        }
      >
        {isDesktop ? <Desktop /> : <App />}
      </Suspense>
    </>
  );
}
