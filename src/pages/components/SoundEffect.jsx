import { useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import { songContext } from "./Song";
import BackButton from "./BackButton";
import {
  ArrowForwardIos,
  RadioButtonCheckedTwoTone,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import OffCanvas from "./BottomSheet";
import { HashContext } from "./Hash";

const defaultFrequency = {
  Flat: {
    60: 0,
    180: 0,
    400: 0,
    1000: 0,
    3000: 0,
    6000: 0,
    12000: 0,
  },
  Rock: {
    60: 5,
    180: 3,
    400: -2,
    1000: -1,
    3000: 3,
    6000: 5,
    12000: 6,
  },
  Pop: {
    60: -1,
    180: 2,
    400: 4,
    1000: 5,
    3000: 4,
    6000: 2,
    12000: -1,
  },
  Jazz: {
    60: 0,
    180: 3,
    400: 4,
    1000: 3,
    3000: 2,
    6000: 3,
    12000: 2,
  },
  Classical: {
    60: 0,
    180: 0,
    400: -2,
    1000: 2,
    3000: 4,
    6000: 5,
    12000: 6,
  },
  Dance: {
    60: 6,
    180: 5,
    400: 1,
    1000: 0,
    3000: 3,
    6000: 4,
    12000: 6,
  },
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

const LineGraph = ({ data, height = 100, width = 300, color = "wheat" }) => {
  if (!data || data.length < 2) return null;

  const maxY = 10;
  const minY = -10;
  const stepX = width / (data.length - 1);

  const getY = (y) => {
    return height - ((y - minY) / (maxY - minY)) * height;
  };

  const points = data.map((y, i) => ({
    x: i * stepX,
    y: getY(y),
  }));

  const createSmoothPath = (pts, closed = false) => {
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const xc = (curr.x + next.x) / 2;
      const yc = (curr.y + next.y) / 2;
      d += ` Q ${curr.x},${curr.y} ${xc},${yc}`;
    }

    d += ` L ${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;

    if (closed) {
      // Draw line down to bottom and back to start to form area
      d += ` L ${pts[pts.length - 1].x},${height}`;
      d += ` L ${pts[0].x},${height} Z`;
    }

    return d;
  };

  const linePath = createSmoothPath(points, false);
  const areaPath = createSmoothPath(points, true);

  const gradientId = "lineGradient";

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
};

export default function SoundEffect() {
  const [frequency, setFrequency] = useState(
    JSON.parse(localStorage.getItem("frequency")) || defaultFrequency["Flat"]
  );
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const [presetName, setPresetName] = useState("Flat");
  const { setQueue } = useContext(songContext);
  const [graphWidth, setGraphWidth] = useState(300);

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

  const detectMatchingPreset = (userEQ) => {
    for (const [presetName, presetEQ] of Object.entries(defaultFrequency)) {
      const isMatch = Object.keys(presetEQ).every(
        (freq) => userEQ[freq] === presetEQ[freq]
      );
      if (isMatch) return presetName;
    }
    return "Custom"; // No exact match found
  };

  useEffect(() => {
    const presetName = detectMatchingPreset(frequency);
    setPresetName(presetName);
  }, [frequency]);

  const setPreset = (preset) => {
    const newFrequency = defaultFrequency[preset];
    setFrequency(newFrequency);
    setQueue({
      type: "AUDIO_EFFECT",
      value: newFrequency,
    });
    setPresetName(preset);
  };

  useEffect(() => {
    const width = document
      .getElementById("graphCont")
      .getBoundingClientRect().width;
    setGraphWidth(width);
  }, []);

  return (
    <div className="page hiddenScrollbar deskScroll">
      <div className="libraryNav mobo">
        <BackButton />
        <p className="text-center text-white fw-light fs-4">
          Equalizer & Sound Effects
        </p>
      </div>
      <div className="effectCont">
        <div>
          <button
            onClick={() => {
              setQueue({
                type: "AUDIO_FX",
                value: "8d",
              });
            }}
          >
            Apply 8D effect
          </button>
          <button
            onClick={() => {
              setQueue({
                type: "AUDIO_FX",
                value: "lofi",
              });
            }}
          >
            Apply Lofi effect
          </button>
          <div className="graphCont" id="graphCont">
            <button
              className="iconButton d-flex align-items-center justify-content-between presetBut mt-4"
              onClick={() => open("presets")}
            >
              <p className="text-white">{presetName}</p>
              <ArrowForwardIos className="text-white-50" />
            </button>
            <LineGraph
              data={Object.values(frequency)}
              width={graphWidth}
              color="wheat"
            />
          </div>
        </div>
        <div className="w-100">
          <div className="equCont mt-3">
            {Object.keys(frequency).map((freq, index) => {
              return (
                <div className="equRangeCont" key={index}>
                  <p className="text-white-50 mt-2">{frequency[freq]} dB</p>
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
                  <p className="text-white-50 mt-2">
                    {frequencyAndLabels[freq]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <OffCanvas
        open={openElements.includes("presets")}
        dismiss={() => close("presets")}
      >
        <div className="contextCont">
          <p className="labelText text-center fw-normal">Equalizer Presets</p>
          <hr className="dividerLine" />
          {presetName == "Custom" && (
            <button className="icoTextBut">
              <RadioButtonCheckedTwoTone className="text-wheat" />
              <p>Custom</p>
            </button>
          )}
          {Object.keys(defaultFrequency).map((preset, index) => {
            return (
              <button
                className="icoTextBut w-100 text-start"
                key={"preset " + index}
                onClick={() => setPreset(preset)}
              >
                {presetName == preset ? (
                  <RadioButtonCheckedTwoTone className="text-wheat" />
                ) : (
                  <RadioButtonUnchecked />
                )}
                <p>{preset}</p>
              </button>
            );
          })}
        </div>
      </OffCanvas>
    </div>
  );
}
