import { useContext } from "react";
import { songContext } from "./Song";
import { ChevronLeftRounded, MoreVertRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import utils from "../../../utils";
import likeOutlined from "../../assets/icons/likeOutlined.svg";

export default function Player() {
  const { Queue, setQueue } = useContext(songContext);
  const navigate = useNavigate();
  const location = useLocation();
  if (Queue?.song?.length == undefined) {
    navigate(location.pathname);
  }
  const RenderPlayer = () => {
    const data = utils.getItemFromId(Queue.song, Queue.playlist.list);
    return (
      <div className="playerCont">
        <div className="player">
          <div className="playerNav">
            <button>
              <ChevronLeftRounded />
            </button>
            <div>
              <p>PLAYING FROM PLAYLIST</p>
              <b>playlist name</b>
            </div>
            <button>
              <MoreVertRounded />
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  return Queue?.song?.length == undefined ? <></> : <RenderPlayer />;
}
