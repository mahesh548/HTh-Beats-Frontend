import { useContext, useMemo, useState } from "react";
import { HashContext } from "./Hash";
import OffCanvas from "./BottomSheet";
import utils from "../../../utils";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import React from "react";

export default function DownloadEntity({ children, styleClass, data }) {
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const [DownloadList, setDownloadList] = useState([]);

  const eleId = useMemo(() => {
    return `down_${data.id}_${Math.random().toString(36).substr(2, 9)}`;
  }, [data.id]);

  const toggleDownload = (id) => {
    if (DownloadList.includes(id)) {
      setDownloadList(DownloadList.filter((item) => item != id));
    } else {
      if (DownloadList.length >= 5) return;
      setDownloadList([...DownloadList, id]);
    }
  };
  const submitDownload = () => {
    const batchData = DownloadList.map((item) => {
      const c = data.list.find((i) => i.id == item);
      return { url: c?.more_info?.encrypted_media_url, title: c?.title };
    });
    setTimeout(() => {
      utils.batchDownload(batchData);
    }, 500);
    close(eleId);
  };
  const downloadQuality = localStorage.getItem("download_quality") || "96";

  return (
    <>
      <button
        className={styleClass}
        onClick={() => {
          if (data?.list?.length != 0) open(eleId);
        }}
      >
        {children}
      </button>

      <OffCanvas
        open={openElements.includes(eleId)}
        dismiss={() => close(eleId)}
      >
        <p className="labelText text-center m-0 ">Download</p>
        <p className="text-white-50 text-center fs-6 fw-light">{data?.title}</p>
        <hr className="dividerLine" />
        <div>
          {data.list.map((item, index) => {
            return (
              <div
                className={`playlistSong mt-4`}
                onClick={() => toggleDownload(item.id)}
                key={"download-" + index}
              >
                <button className="iconButton">
                  {DownloadList.includes(item.id) ? (
                    <CheckBox className="text-primary" />
                  ) : (
                    <CheckBoxOutlineBlank />
                  )}
                </button>

                <div className="extendedGrid">
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.title)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {utils.refineText(item.subtitle)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: "110px" }}></div>
        {DownloadList.length != 0 && (
          <div
            className="position-fixed bottom-0 left-0 w-100 pb-3 text-center"
            style={{ background: "#1f1f1f" }}
          >
            <button className="addToBut mb-2" onClick={() => submitDownload()}>
              Download {DownloadList.length}/5 songs
            </button>
            <i className="text-white-50 fw-light">
              You can download 5 songs at once in <b>{downloadQuality} kbps</b>.
            </i>
          </div>
        )}
      </OffCanvas>
    </>
  );
}
