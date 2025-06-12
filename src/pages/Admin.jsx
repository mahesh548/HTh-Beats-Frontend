import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./components/Auth";
import { useNavigate } from "react-router";
import utils from "../../utils";
import PageLoader from "./components/PageLoader";
import { ArrowForwardIos } from "@mui/icons-material";

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [countData, setCountData] = useState(null);
  const navigate = useNavigate();

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`HTh Beats - Admin`);
    }
  }

  useEffect(() => {
    const countData = async () => {
      const response = await utils.BACKEND("/admin", "POST", {
        adminAction: {
          action: "getCounts",
        },
      });
      if (response.status === true) {
        setCountData(response.data);
      } else {
        setCountData(null);
      }
    };
    if (user && user.role === "admin") {
      countData();
    }
  }, [user]);
  if (!user || !user.role || user.role !== "admin") {
    // If the user is not an admin, redirect to home
    navigate("/home");
    return <></>;
  }
  if (!countData) {
    return <PageLoader />;
  }

  return (
    <div className="page ">
      <h1 className="text-white ps-4 mt-4 mb-4">Hello, Admin</h1>
      <div className="promoCont">
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Verified Users</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.users} accounts
          </button>
        </div>
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Admins</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.admin} accounts
            <ArrowForwardIos className="fs-6 ms-2" />
          </button>
        </div>
      </div>
      <hr className="dividerLine" />
      <div className="promoCont">
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Download permission</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.users} accounts allowed
          </button>
        </div>
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Download request</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.admin} requests
            <ArrowForwardIos className="fs-6 ms-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
