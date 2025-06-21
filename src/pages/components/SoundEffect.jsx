import { useContext, useState } from "react";
import utils from "../../../utils";
import { songContext } from "./Song";

const defaultFrequency = {
  60: 0,
  180: 0,
  400: 0,
  1000: 0,
  3000: 0,
  6000: 0,
  12000: 0,
};
const frequencyAndLabels = {
  60: "60Hz",
  180: "180Hz",
  400: "400Hz",
  1000: "1kHz",
  3000: "3kHz",
  6000: "6kHz",
  12000: "12kHz",
};

export default function SoundEffect() {
  const [frequency, setFrequency] = useState(
    JSON.parse(localStorage.getItem("frequency")) || defaultFrequency
  );
  const { setQueue } = useContext(songContext);

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`HTh Beats - Effects`);
    }
  }
  const setFreq = (value, freq) => {
    const newFrequency = {
      ...frequency,
      [freq]: parseInt(value),
    };
    setFrequency(newFrequency);

    setQueue({
      type: "AUDIO_EFFECT",
      value: newFrequency,
    });
  };
  const getSliderBackground = (
    value,
    min = -10,
    max = 10,
    fillColor = "wheat",
    bgColor = "grey"
  ) => {
    const percent = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to top, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%, ${bgColor} 100%)`;
  };

  return (
    <div className="page hiddenScrollbar deskScroll">
      <div className="equCont mt-3">
        {Object.keys(frequency).map((freq, index) => {
          return (
            <div className="equRangeCont" key={index}>
              <input
                type="range"
                min={-10}
                max={10}
                className="equ"
                value={frequency[freq]}
                onInput={(e) => setFreq(e.target.value, freq)}
                step={1}
                style={{
                  background: getSliderBackground(frequency[freq]),
                }}
              />
              <p className="text-white-50 mt-2">{frequencyAndLabels[freq]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
