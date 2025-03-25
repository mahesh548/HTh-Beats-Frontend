import { useContext } from "react";
import OffCanvas from "./BottomSheet";
import { HashContext } from "./Hash";
import utils from "../../../utils";
import { songContext } from "./Song";

export default function CreateRadio({ data }) {
  const { openElements, open, close } = useContext(HashContext);

  const { setQueue } = useContext(songContext);
  const playRadio = async (data) => {
    close(data.id);
    if (
      !data?.more_info?.language &&
      !data?.more_info?.station_display_text &&
      data?.more_info?.featured_station_type != "featured"
    )
      return;

    const response = await utils.API(
      `/radio?entity=featured&name=${data.more_info.station_display_text}&lang=${data.more_info.language}`,
      "GET"
    );
    if (response.status && response.data) {
      const playlist = {
        title: data.title,
        type: "radio",
        list: response.data,
      };
      setQueue({
        type: "NEW",
        value: {
          playlist: playlist,
          song: response.data[0].id,
          status: "play",
        },
      });
    }
  };
  return (
    <>
      <button
        className="browseCard"
        style={{ background: data?.more_info?.color }}
        onClick={() => open(data.id)}
      >
        <p className="text-white text-start fw-bold p-1">
          {utils.refineText(data?.title)}
        </p>
        <img src={data.image} />
      </button>

      <OffCanvas
        open={openElements.includes(data.id)}
        dismiss={() => close(data.id)}
      >
        <div className="w-100 px-3 text-center">
          <img
            src={data.image}
            style={{ borderRadius: "8px", boxShadow: "0 0 20px #0000009d" }}
          />
          <div className="my-4">
            <p className="text-white">{utils.refineText(data?.title)}</p>
            <p className="text-white-50">
              {utils.refineText(data?.more_info?.description) ||
                utils.refineText(data?.more_info?.language)}
            </p>
          </div>
          <button
            className="addToBut text-white w-100"
            style={{ background: data?.more_info?.color }}
            onClick={() => playRadio(data)}
          >
            Play this radio
          </button>
        </div>
      </OffCanvas>
    </>
  );
}
