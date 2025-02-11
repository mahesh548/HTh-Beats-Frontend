import {
  GroupOutlined,
  MoreVertRounded,
  NextPlanOutlined,
  PlaylistAddOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useContext, useMemo } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import utils from "../../../utils";
import likeOutlined from "../../assets/icons/likeOutlined.svg";
import downloadOutlined from "../../assets/icons/downloadOutlined.svg";

export default function OptionSong({ styleClass, data, addId }) {
  const { openElements, open, close, openOne } = useContext(HashContext);

  const eleId = useMemo(() => {
    return `more_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  return (
    <>
      <button className={styleClass} onClick={() => open(eleId)}>
        <MoreVertRounded />
      </button>

      <OffCanvas
        open={openElements.includes(eleId)}
        dismiss={() => close(eleId)}
      >
        <div className="prevCont">
          <div
            className="playlistSong"
            style={{
              width: "95%",
              margin: "auto",
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            <img
              src={data.image}
              alt={data.title}
              className="playlistSongImg"
            />
            <div>
              <p className="thinOneLineText playlistSongTitle">
                {utils.refineText(data.title)}
              </p>
              <p className="thinOneLineText playlistSongSubTitle">
                {data.subtitle?.length != 0
                  ? utils.refineText(data.subtitle)
                  : utils.refineText(
                      `${data.more_info?.music}, ${data.more_info?.album}, ${data.more_info?.label}`
                    )}
              </p>
            </div>
            <div></div>
            <div></div>
          </div>
          <button
            className="icoTextBut"
            onClick={() => {
              close(eleId);
              setTimeout(() => {
                openOne(addId);
              }, 500);
            }}
          >
            <img src={likeOutlined} />
            <p>Add to playlists</p>
          </button>
          <button className="icoTextBut">
            <NextPlanOutlined />
            <p>Play next</p>
          </button>
          <button className="icoTextBut">
            <PlaylistAddOutlined />
            <p>Add to queue</p>
          </button>
          <button className="icoTextBut">
            <GroupOutlined />
            <p>Listen to artist</p>
          </button>
          <button className="icoTextBut">
            <ShareOutlined />
            <p>Share</p>
          </button>
          <button className="icoTextBut">
            <img src={downloadOutlined} />
            <p>Download</p>
          </button>
        </div>
      </OffCanvas>
    </>
  );
}
