import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./components/Auth";
import { useNavigate } from "react-router";
import utils from "../../utils";
import PageLoader from "./components/PageLoader";
import { ArrowForwardIos, Close } from "@mui/icons-material";
import OffCanvas from "./components/BottomSheet";
import { HashContext } from "./components/Hash";
import { showToast } from "./components/showToast";
import LoginInput from "./components/LoginInput";
import { isArray } from "lodash";

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [countData, setCountData] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });

  const [users, setUsers] = useState([]);

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
    setUsers([]);
    setUsername({
      input: "",
      message: "",
      disable: true,
    });
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
  const updateAdmin = async (userId, status) => {
    close("adminList");
    setUsers([]);
    setUsername({
      input: "",
      message: "",
      disable: true,
    });
    if (userId === user.id) {
      showToast({
        text: "You cannot change your own role.",
      });
      return;
    }
    const response = await utils.BACKEND("/admin", "POST", {
      adminAction: {
        role: status,
        targetId: userId,
        action: "updateRole",
      },
    });
    if (response.status === true) {
      setCountData(null);
      await getCountData();
      showToast({
        text: `Role has been updated for the user.`,
      });
    } else {
      showToast({
        text: "Failed to update role of user. Please try again later.",
      });
    }
  };

  useEffect(() => {
    if (username.input.length === 0) {
      setUsers([]);
      return;
    }
    const searchUser = async () => {
      setUsers("loading");

      const response = await utils.BACKEND("/admin", "POST", {
        adminAction: {
          action: "searchUser",
          searchId: username.input,
        },
      });
      if (response.status === true) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    };
    const verify = utils.verifyValue(username.input, "u");
    if (verify === "pass") {
      setUsername({
        ...username,
        disable: false,
        message: "",
      });
      searchUser();
    } else {
      setUsername({
        ...username,
        disable: true,
        message: verify,
      });
    }
  }, [username.input]);

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
          <div className="countTitle text-white fs-4">Downloading Granted</div>
          <button className="iconButton text-white fs-6 p-0">
            {countData?.UsersCount?.approved} accounts allowed
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
        <p className="text-center text-danger">Manage Admins !!</p>
        <div className="userSrch">
          <LoginInput
            placeholder="Search Username"
            formData={username}
            setFormData={setUsername}
          />
          <div>
            {username.input.length > 0 && users.length === 0 && (
              <p className="text-white-50 text-center mt-2">No user found. </p>
            )}
            {username.input.length > 0 && users === "loading" && (
              <p className="text-white-50 text-center mt-2">Loading... </p>
            )}
            {isArray(users) &&
              users.map((data, index) => {
                return (
                  <div
                    className="playlistSong mt-3 px-2 mb-3"
                    style={{ gridTemplateColumns: "50px 1fr auto" }}
                    key={data?.id + index}
                  >
                    <img
                      src={data?.pic}
                      className="playlistSongImg rounded-circle"
                    />
                    <div>
                      <p className="thinOneLineText playlistSongTitle fw-normal">
                        {data?.username}
                      </p>
                      <p className="thinOneLineText playlistSongSubTitle">
                        {utils.formatTimestamp(data?.createdAt)}.
                      </p>
                    </div>
                    {data?.role == "user" ? (
                      <button
                        className="addToBut fs-6 px-2 py-1 fw-normal rounded-3"
                        onClick={() => updateAdmin(data?.id, "admin")}
                      >
                        Set Admin
                      </button>
                    ) : (
                      <button
                        className="addToBut fs-6 px-2 py-1 fw-normal bg-danger text-white rounded-3"
                        onClick={() => updateAdmin(data?.id, "user")}
                      >
                        Drop Admin
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <hr className="dividerLine" />
        {countData?.detailData?.admins?.length > 0 && (
          <p className="text-white-50 text-start ps-2">Active admins</p>
        )}
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
        <p className="text-center text-white-50">
          Manually allow user to download
        </p>
        <div className="userSrch">
          <LoginInput
            placeholder="Search Username"
            formData={username}
            setFormData={setUsername}
          />
          <div>
            {username.input.length > 0 && users.length === 0 && (
              <p className="text-white-50 text-center mt-2">No user found. </p>
            )}
            {username.input.length > 0 && users === "loading" && (
              <p className="text-white-50 text-center mt-2">Loading... </p>
            )}
            {isArray(users) &&
              users.map((data, index) => {
                return (
                  <div
                    className="playlistSong mt-3 px-2 mb-3"
                    style={{ gridTemplateColumns: "50px 1fr auto" }}
                    key={data?.id + index}
                  >
                    <img
                      src={data?.pic}
                      className="playlistSongImg rounded-circle"
                    />
                    <div>
                      <p className="thinOneLineText playlistSongTitle fw-normal">
                        {data?.username}
                      </p>
                      <p className="thinOneLineText playlistSongSubTitle">
                        {utils.formatTimestamp(data?.createdAt)}.
                      </p>
                    </div>
                    {data?.downloadAccess == "approved" ? (
                      <button
                        className="addToBut fs-6 px-2 py-1 fw-normal bg-danger text-white rounded-3"
                        onClick={() =>
                          updateDownloadPermission(data?.id, "default")
                        }
                      >
                        Reset
                      </button>
                    ) : (
                      <button
                        className="addToBut fs-6 px-2 py-1 fw-normal rounded-3"
                        onClick={() =>
                          updateDownloadPermission(data?.id, "approved")
                        }
                      >
                        Allow
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <hr className="dividerLine" />
        {countData?.detailData?.requests?.length > 0 && (
          <p className="text-white-50 text-center text-start ps-2">
            Pending requests
          </p>
        )}
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
