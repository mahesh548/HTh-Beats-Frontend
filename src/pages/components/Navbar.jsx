import { useNavigate, Outlet, Link, useLocation } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Auth";

//icons
import homeSvgFilled from "../../assets/icons/homeSvgFilled.svg";
import homeSvgOutlined from "../../assets/icons/homeSvgOutlined.svg";
import searchSvgFilled from "../../assets/icons/searchSvgFilled.svg";
import searchSvgOutlined from "../../assets/icons/searchSvgOutlined.svg";
import librarySvgFilled from "../../assets/icons/librarySvgFilled.svg";
import librarySvgOutlined from "../../assets/icons/librarySvgOutlined.svg";

//icons
import { Add } from "@mui/icons-material";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await auth.authentication();
      console.log(isAuth);
      if (!isAuth) {
        localStorage.clear();
        navigate("/HTh-Beats");
      }
    };
    checkAuth();
  }, []);

  const isActive = (path) => location.pathname === path;
  return (
    <>
      <div className="navBOTTOM">
        <Link to="/home">
          <div className="navBTN">
            <button>
              <img src={isActive("/home") ? homeSvgFilled : homeSvgOutlined} />
              <p className="menuLab">Home</p>
            </button>
          </div>
        </Link>
        <Link to="/search">
          <div className="navBTN">
            <button>
              <img
                src={isActive("/search") ? searchSvgFilled : searchSvgOutlined}
              />
              <p className="menuLab">Search</p>
            </button>
          </div>
        </Link>

        <div className="navBTN">
          <button>
            <Add />
            <p className="menuLab">Create</p>
          </button>
        </div>
        <Link to="library">
          <div className="navBTN">
            <button>
              <img
                src={
                  isActive("/library") ? librarySvgFilled : librarySvgOutlined
                }
              />
              <p className="menuLab">Library</p>
            </button>
          </div>
        </Link>
        <Link to="profile">
          <div className="navBTN">
            <button>
              <img
                src={auth?.user?.pic ? auth?.user?.pic : "logo.png"}
                className="navBottomProfilePicture"
                alt="porfile picture"
              />
              <p className="menuLab">Profile</p>
            </button>
          </div>
        </Link>
      </div>
      <Outlet />
    </>
  );
}
