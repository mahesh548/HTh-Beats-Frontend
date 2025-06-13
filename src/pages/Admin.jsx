import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./components/Auth";
import { useNavigate } from "react-router";
import utils from "../../utils";
import PageLoader from "./components/PageLoader";
import { ArrowForwardIos, Close } from "@mui/icons-material";
import OffCanvas from "./components/BottomSheet";
import { HashContext } from "./components/Hash";
import { showToast } from "./components/showToast";

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [countData, setCountData] = useState(null);
  const navigate = useNavigate();

  const { openElements, open, close } = useContext(HashContext);

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`HTh Beats - Admin`);
    }
  }
  const getCountData = async () => {
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
  useEffect(() => {
    if (user && user.role === "admin") {
      getCountData();
    }
  }, [user]);

  const updateDownloadPermission = async (userId, status) => {
    close("downRequest");
    const response = await utils.BACKEND("/updateAccess", "POST", {
      accessData: {
        access: status,
        targetId: userId,
      },
    });
    if (response.status === true) {
      setCountData(null);
      await getCountData();
      showToast({
        text: `Download permission has been updated for the user.`,
      });
    } else {
      showToast({
        text: "Failed to update download permission. Please try again later.",
      });
    }
  };

  if (!user || !user.role || user.role !== "admin") {
    // If the user is not an admin, redirect to home
    navigate("/home");
    return <></>;
  }
  if (!countData) {
    return <PageLoader />;
  }

  return (
    <div className="page hiddenScrollbar deskScroll">
      <h1 className="text-white ps-4 mt-4 mb-4">Hello, Admin</h1>
      <div className="promoCont">
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Verified Users</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.users} accounts
          </button>
        </div>
        <div className="countCard p-3 " onClick={() => open("adminList")}>
          <div className="countTitle text-white fs-4">
            Admins <ArrowForwardIos className="fs-6 ms-2" />
          </div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.admin} accounts
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
        <div className="countCard p-3 " onClick={() => open("downRequest")}>
          <div className="countTitle text-white fs-4">
            Download request
            <ArrowForwardIos className="fs-6 ms-2" />
          </div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.request} requests
          </button>
        </div>
      </div>
      <hr className="dividerLine" />
      <div className="promoCont">
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Scraped songs</div>
          <button className="iconButton text-white fs-6 p-0">
            {utils.formatMetric(countData?.EntityCount?.songs)} songs
          </button>
        </div>
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Scraped playlists</div>
          <button className="iconButton text-white fs-6 p-0">
            {utils.formatMetric(countData?.EntityCount?.playlists)} playlists
          </button>
        </div>
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Scraped albums</div>
          <button className="iconButton text-white fs-6 p-0">
            {utils.formatMetric(countData?.EntityCount?.albums)} albums
          </button>
        </div>
        <div className="countCard p-3 ">
          <div className="countTitle text-white fs-4">Scraped mixes</div>
          <button className="iconButton text-white fs-6 p-0">
            {utils.formatMetric(countData?.EntityCount?.mixes)} mixes
          </button>
        </div>
      </div>
      <OffCanvas
        open={openElements.includes("adminList")}
        dismiss={() => close("adminList")}
      >
        <p className="text-white text-center">
          {countData?.detailData?.admins?.length} Admins
        </p>
        <hr className="dividerLine" />
        {countData?.detailData?.admins?.map((data, index) => {
          return (
            <div
              className="playlistSong mt-3 px-2 mb-3"
              style={{ gridTemplateColumns: "50px auto 40px" }}
              key={"admin-" + index}
            >
              <img src={data?.pic} className="playlistSongImg rounded-circle" />
              <div>
                <p className="thinOneLineText playlistSongTitle fw-normal">
                  {data?.username}
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  Created: {utils.formatTimestamp(data?.createdAt)}.
                </p>
              </div>
            </div>
          );
        })}
      </OffCanvas>
      <OffCanvas
        open={openElements.includes("downRequest")}
        dismiss={() => close("downRequest")}
      >
        <p className="text-white text-center">
          {countData?.detailData?.requests?.length} Requests
        </p>
        <hr className="dividerLine" />
        {countData?.detailData?.requests?.map((data, index) => {
          return (
            <div
              className="playlistSong mt-3 px-2 mb-3"
              style={{
                gridTemplateColumns: "50px 1fr auto auto",
                minWidth: "300px",
              }}
              key={"request-" + index}
            >
              <img src={data?.pic} className="playlistSongImg rounded-circle" />
              <div>
                <p className="thinOneLineText playlistSongTitle fw-normal">
                  {data?.username}
                </p>
                <p className="thinOneLineText playlistSongSubTitle">
                  Created: {utils.formatTimestamp(data?.createdAt)}.
                </p>
              </div>

              <button
                className="addToBut fs-6 px-2 py-1 fw-normal"
                onClick={() => updateDownloadPermission(data?.id, "approved")}
              >
                Allow
              </button>
              <button
                className="iconButton fs-6 p-0"
                onClick={() => updateDownloadPermission(data?.id, "default")}
              >
                <Close />
              </button>
            </div>
          );
        })}
      </OffCanvas>
    </div>
  );
}
