import { useNavigate } from "react-router";
import utils from "../../utils";
import {
  ArrowCircleDown,
  BatchPrediction,
  EqualizerOutlined,
  FormatQuote,
  History,
  LibraryMusicOutlined,
  LightbulbCircleOutlined,
  LightbulbOutlined,
  QueueMusic,
  ShapeLineSharp,
  VerticalAlignBottom,
  Warning,
} from "@mui/icons-material";
const logoUrl = "";
export default function Launch() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const goToSignup = () => {
    navigate("/signup");
  };
  utils.editMeta("Hertz To hearts - Beats", "#353535");

  const Footer = () => {
    return (
      <footer className="bg-black text-white pt-5 pb-4 mt-5">
        <div className="container">
          <div className="row">
            {/* Logo + Short Disclaimer */}
            <div className="col-md-3 col-12 mb-4">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png"
                alt="HTh Beats Logo"
                style={{ width: "40px" }}
              />
            </div>

            {/* Social Links */}
            <div className="col-md-2 col-6 mb-4">
              <h6 className="text-uppercase fw-bold">Connect</h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://x.com/i__maheshmishra"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/i__maheshmishra/"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mahesh548"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Open Source */}
            <div className="col-md-2 col-6 mb-4">
              <h6 className="text-uppercase fw-bold">Open Source</h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://github.com/mahesh548/HTh-Beats-Frontend"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    Frontend Code
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mahesh548/HTh-Beats-Backend"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    Backend Code
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mahesh548/HTh-Beats-API"
                    className="text-white-50 text-decoration-none fw-light"
                    target="_"
                  >
                    API Code
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white-50 text-decoration-none  fw-light"
                  >
                    How HTh Beats Works ?
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-md-2 col-6 mb-4">
              <h6 className="text-uppercase fw-bold">Contact</h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="mailto:hertztohearts.beats@gmail.com"
                    className="text-white-50 text-decoration-none fw-light"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mkmjnp5@gmail.com"
                    className="text-white-50 text-decoration-none fw-light"
                  >
                    Developer
                  </a>
                </li>
              </ul>
            </div>
            {/* Signature */}
            <div className="col-md-3 col-12 mt-4 text-center mb-3">
              <p className="small text-muted">
                Made with code by{" "}
                <a
                  href="https://www.instagram.com/i__maheshmishra/"
                  className="text-white-50"
                  target="_"
                >
                  @Mahesh
                </a>
              </p>
            </div>
            <hr className="dividerLine" />
            <div
              class="alert alert-black m-auto text-center fw-light"
              role="alert"
            >
              <Warning />
              <br />
              <b>Disclaimer</b>
              <br />
              <b>HTh Beats</b> does not host or promote any pirated content. All
              media available on this platform is sourced from <b>JioSaavn</b>{" "}
              and remains the property of its rightful owners. This project is
              created solely for <b>educational</b> and <b>demonstration</b>{" "}
              purposes.
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <div
      className="launchPage-b hiddenScrollbar deskScroll p-0 m-0"
      style={{ background: "#616a731f" }}
    >
      <div className="launchNav mt-0 ps-4">
        <div className="loginTitle">
          <img
            src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png"
            alt="logo"
          />
          <p className="desk text-white">Beats</p>
        </div>

        <div>
          <button
            onClick={goToSignup}
            className="addToBut d-inline  fw-bold mt-0 px-4 text-black"
          >
            Start Listening
          </button>
        </div>
      </div>

      <div className="heroCont">
        <div className="launchTextWrap mt-5 px-2 ">
          <h1 className="heroText text-white ps-4">
            Listen millions of song for free without limit and without ads
          </h1>
          <p className="text-white mt-2 mb-2 fs-6 ps-4">
            HTh Beats where music travels from Hertz to Hearts.
          </p>
          <div className="px-4">
            <button
              onClick={goToSignup}
              className="addToBut fw-bold bg-white text-black mt-4"
            >
              Sign up for free
            </button>
            <button
              onClick={goToLogin}
              className="addToBut fw-bold text-white"
              style={{
                background: "transparent",
                border: "1.5px solid white",
              }}
            >
              Log in
            </button>
          </div>
        </div>
        <div className="launchImageWrap">
          <img
            src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790064/launchPageBanner_mals7f.png"
            className="launchBanner"
          />
        </div>
      </div>
      <div className="deskFWrap">
        <div
          className="text-center px-3 fBs"
          style={{ marginTop: "7rem", marginBottom: "7rem" }}
        >
          <p className="heroText text-wheat ">
            Explore features that elevate your listening experience
          </p>
          <p className="text-white-50 mt-2 mb-2 fs-6 fw-light">
            HTh Beats isn’t just another music app — it’s packed with thoughtful
            tools designed to make every beat personal, social, and
            unforgettable. Scroll down to see what makes us different.
          </p>
        </div>
        <div className="deskFCont">
          <div className="featureCard px-4 pt-5 pb-5">
            <div className="w-100">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790063/feature_playlist_a2q7hy.png"
                className="w-100 deskFb"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">Playlist and Collabs</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Listen solo or with friends by adding and removing songs
                together. Music made personal and fun.
              </p>
            </div>
          </div>
          <div className="featureCard px-4 pt-5 pb-5">
            <div className="w-100 text-center">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790063/feature_No_ads_q6tn3y.png"
                className="w-100 deskFb"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">No Advertisement</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Stream unlimited songs with zero ads and no hidden costs. Just
                free, seamless listening—anytime you want.
              </p>
            </div>
          </div>
          <div className="featureCard px-4 pt-5 pb-5 bigCard">
            <div className="w-100 ">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790062/feature_music_room_oguopn.png"
                className="w-100 deskFb"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">Music Room</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Create a room, invite friends, and enjoy the same track at the
                same time. Drop stickers and share the vibe like you're all
                together.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="FsWrap pt-5 px-3 pb-5">
        <div className="lilFeatureCard px-2">
          <EqualizerOutlined className="text-white" />
          <p className="text-white fs-6 mt-1">High Quality Audio</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Enjoy crystal-clear sound up to 320Kbps.
          </p>
        </div>
        <div className="lilFeatureCard px-2">
          <QueueMusic className="text-white" />
          <p className="text-white fs-6 mt-1">Song Queue</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Easily control what plays next.
          </p>
        </div>

        <div className="lilFeatureCard px-2">
          <FormatQuote className="text-white" />
          <p className="text-white fs-6 mt-1">Lyrics Support</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Catch every word as the music plays.
          </p>
        </div>
        <div className="lilFeatureCard px-2">
          <ArrowCircleDown className="text-white" />
          <p className="text-white fs-6 mt-1">Offline Downloads</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Save your favorite songs in high quality.
          </p>
        </div>
      </div>
      <div className="deskFWrap mt-5">
        <div className="deskFCont ">
          <div className="featureCard px-4 pt-5 pb-5">
            <div className="w-100">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790062/feature_install_pdfidk.png"
                className="w-100 deskFb mobo mb-3"
                alt=""
              />
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790062/feature_install_desk_hays7z.png"
                className="w-100 deskFb desk"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">Install App</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Easily add it to your home screen and enjoy quicker access with
                a smooth experience that feels just right for everyday music
                streaming.
              </p>
            </div>
          </div>
          <div className="featureCard px-4 pt-5 pb-5 ">
            <div className="w-100 text-center">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790063/feature_speed_rlmfpd.png"
                className="w-100 deskFb"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">Fast Downloads</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Enjoy smooth and reliable download speeds so you can start
                listening sooner. No long delays, just quick and easy access to
                your favorite tracks.
              </p>
            </div>
          </div>
          <div className="featureCard px-4 pt-5 pb-5 bigCard">
            <div className="w-100 text-center">
              <img
                src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748790062/feature_lang_zbnq42.png"
                className="w-100 deskFb"
                alt=""
              />
            </div>
            <div>
              <p className=" text-wheat">Multi Language</p>
              <p className="text-white-50 mt-2 mb-2 fs-6 fw-light desk-80w">
                Explore songs in <b>sixteen</b> different languages and mix them
                the way you like. Choose your favorites and get personalized
                recommendations that match your taste.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="FsWrap pt-5 px-3 pb-5">
        <div className="lilFeatureCard px-2">
          <ShapeLineSharp className="text-white" />
          <p className="text-white fs-6 mt-1">Modern Design</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Enjoy a smooth and stylish interface made for easy navigation.
          </p>
        </div>
        <div className="lilFeatureCard px-2">
          <BatchPrediction className="text-white" />
          <p className="text-white fs-6 mt-1">Smart Recommendations</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Discover songs you’ll love with personalized music suggestions.
          </p>
        </div>

        <div className="lilFeatureCard px-2">
          <History className="text-white" />
          <p className="text-white fs-6 mt-1">Playback History</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            View and revisit everything you’ve recently played.
          </p>
        </div>
        <div className="lilFeatureCard px-2">
          <LibraryMusicOutlined className="text-white" />
          <p className="text-white fs-6 mt-1">Your Library</p>

          <p className="text-white-50 fs-6 mt-1 fw-light">
            Create, save, and collab on playlists — all organized in one place.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
