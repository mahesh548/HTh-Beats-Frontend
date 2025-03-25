import { useContext } from "react";
import OffCanvas from "./BottomSheet";
import { HashContext } from "./Hash";
import utils from "../../../utils";

export default function CreateRadio({ data }) {
  const { openElements, open, close } = useContext(HashContext);
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
          >
            Play this radio
          </button>
        </div>
      </OffCanvas>
    </>
  );
}
