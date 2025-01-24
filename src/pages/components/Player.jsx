import { useContext } from "react";
import { songContext } from "./Song";
import {
  ChevronLeftRounded,
  FormatQuoteRounded,
  IosShareRounded,
  MoreHorizRounded,
  PlayCircleFilled,
  QueueMusicOutlined,
  RepeatOutlined,
  ShareOutlined,
  ShareRounded,
  SkipNextRounded,
  SkipPreviousRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import utils from "../../../utils";
import likeOutlined from "../../assets/icons/likeOutlinedPlayer.svg";
import downloadOutlined from "../../assets/icons/downloadOutlinedPlayer.svg";
import playlistOutlined from "../../assets/icons/playlistOutlined.svg";
export default function Player() {
  const { Queue, setQueue } = useContext(songContext);
  const navigate = useNavigate();
  const location = useLocation();
  const closePlayer = () => {
    navigate(location.pathname);
  };
  if (Queue?.song?.length == undefined) {
    closePlayer();
  }

  const RenderPlayer = () => {
    const data = utils.getItemFromId(Queue.song, Queue.playlist.list);
    return (
      <div className="playerCont">
        <div className="blurPage">
          <div></div>
          <img src={data.image} alt="" />
        </div>
        <div className="player">
          <div className="playerNav">
            <button onClick={() => closePlayer()}>
              <ChevronLeftRounded />
            </button>
            <div>
              <p>PLAYING FROM {Queue.playlist.type.toUpperCase()}</p>
              <b
                className="thinOneLineText"
                style={{ color: "white", fontWeight: "bold" }}
              >
                {Queue.playlist.title}
              </b>
            </div>
            <button>
              <MoreHorizRounded />
            </button>
          </div>
          <img
            src={data.image.replace("150x150", "500x500")}
            alt={data.title}
            className="playerBanner"
          />
          <div className="playerController">
            <div className="playerDetails">
              <div>
                <p className="thinOneLineText playerTitle">
                  {utils.refineText(data.title)}
                </p>
                <p className="thinOneLineText playerSubtitle">
                  {data.subtitle?.length != 0
                    ? utils.refineText(data.subtitle)
                    : utils.refineText(
                        `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                      )}
                </p>
              </div>
              <button>
                <img src={likeOutlined} alt="" />
              </button>
              <button className="lyricsLine">
                <FormatQuoteRounded />
                {data.more_info.has_lyrics ? (
                  <p>{data.more_info.lyrics_snippet}</p>
                ) : (
                  <p>No Lyrics</p>
                )}
              </button>
            </div>
            <input
              className="sliderRange"
              type="range"
              /*  oninput="seek()" */
              id="range"
              value="0"
              width="100%"
              /* style="border-radius: 40px; " */
            />
            <div id="cd" class="cd">
              00:00
            </div>
            <div id="fd" class="fd">
              00:00
            </div>
            <div className="playerButtons">
              <button style={{ justifyContent: "start" }}>
                <img src={downloadOutlined} width={"30px"} />
              </button>
              <button>
                <SkipPreviousRounded style={{ fontSize: "60px" }} />
              </button>
              <button>
                <PlayCircleFilled style={{ fontSize: "70px" }} />
              </button>
              <button>
                <SkipNextRounded style={{ fontSize: "60px" }} />
              </button>
              <button style={{ justifyContent: "end" }}>
                <img src={playlistOutlined} width={"30px"} />
              </button>
            </div>
          </div>
          <div className="playerBottomBar">
            <button>
              <RepeatOutlined />
            </button>
            <button>
              <ShareOutlined />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return Queue?.song?.length == undefined ? <></> : <RenderPlayer />;
}
