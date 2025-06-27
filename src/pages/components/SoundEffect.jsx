import { useContext, useEffect, useState } from "react";
import utils from "../../../utils";
import { songContext } from "./Song";
import BackButton from "./BackButton";
import {
  AnimationOutlined,
  ArrowForwardIos,
  Equalizer,
  LeakAddOutlined,
  RadioButtonCheckedTwoTone,
  RadioButtonUnchecked,
  Settings,
  ThreeDRotationOutlined,
} from "@mui/icons-material";
import OffCanvas from "./BottomSheet";
import { HashContext } from "./Hash";

const defaultFrequency = {
  Flat: {
    60: 0,
    150: 0,
    400: 0,
    1000: 0,
    2400: 0,
    15000: 0,
  },
  Rock: {
    60: 5,
    150: 3,
    400: -2,
    1000: -1,
    2400: 3,
    15000: 5,
  },
  Pop: {
    60: -1,
    150: 2,
    400: 4,
    1000: 5,
    2400: 2,
    15000: 0,
  },
  Jazz: {
    60: 0,
    150: 3,
    400: 4,
    1000: 3,
    2400: 3,
    15000: 2,
  },
  Classical: {
    60: 0,
    150: 0,
    400: -2,
    1000: 2,
    2400: 4,
    15000: 5,
  },
  Dance: {
    60: 6,
    150: 5,
    400: 1,
    1000: 0,
    2400: 4,
    15000: 6,
  },
};

const headphoneSettings = {
  _: {
    name: "None",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/default_headphone_wwf6pw.png",
    id: "_",
    accentColor: "wheat",
    eq: {
      60: 0,
      150: 0,
      400: 0,
      1000: 0,
      2400: 0,
      15000: 0,
    },
  },
  earpods: {
    name: "Apple earpods",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005620/earpods_lwwpn3.png",
    id: "earpods",
    accentColor: "cadetblue",
    eq: {
      60: 18.2,
      150: -2.6,
      400: 1.8,
      1000: -3.2,
      2400: -2.3,
      15000: 5.0,
    },
  },
  airpodsPro2: {
    name: "AirPods Pro 2",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005620/airpods2_fl8anb.png",
    id: "airpodsPro2",
    accentColor: "crimson",
    eq: {
      60: 2.0,
      150: -0.4,
      400: -2.4,
      1000: -1.3,
      2400: 3.8,
      15000: -1.1,
    },
  },

  realmeAir5: {
    name: "Realme Buds Air 5 Pro",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/realmebuds5_p95tx7.png",
    id: "realmeAir5",
    accentColor: "darkorange",
    eq: {
      60: 1.0,
      150: -1.8,
      400: -2.4,
      1000: 0.1,
      2400: 2.6,
      15000: -12.1,
    },
  },

  samsungBudsPlus: {
    name: "Galaxy Buds Plus",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/GalaxyBudsPlus_dfueid.png",
    id: "samsungBudsPlus",
    accentColor: "darkslateblue",
    eq: {
      60: 0.2,
      150: -0.5,
      400: -1.4,
      1000: 0.4,
      2400: -0.8,
      15000: 9.1,
    },
  },
  samsungBudsLive: {
    name: "Galaxy Buds Live",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/GalaxyBudsLive_rbjgmr.png",
    id: "samsungBudsLive",
    accentColor: "darkslategray",
    eq: {
      60: 4.2,
      150: -2.7,
      400: -0.7,
      1000: -0.8,
      2400: 0.6,
      15000: 12.4,
    },
  },
  xiaomi: {
    name: "Xiaomi Mi ANC",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005620/XiaomiAnc_gslydy.png",
    id: "xiaomi",
    accentColor: "brown",
    eq: {
      60: 8.8,
      150: -0.2,
      400: -3.0,
      1000: -7.6,
      2400: 4.7,
      15000: -1.9,
    },
  },
  mark: {
    name: "Mark Levinson No 5909",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005922/Mark_gri8ms.png",
    id: "mark",
    accentColor: "coral",
    eq: {
      60: 0.8,
      150: -1.1,
      400: 0.9,
      1000: -1.0,
      2400: 1.3,
      15000: -6.9,
    },
  },
  oppoEnco: {
    name: "Oppo Enco Air3",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/OppoEnco_ypuzro.png",
    id: "oppoEnco",
    accentColor: "darkorchid",
    eq: {
      60: 0.8,
      150: -7.5,
      400: -0.8,
      1000: -0.6,
      2400: 5.8,
      15000: 6.3,
    },
  },
  oppoPm2: {
    name: "Oppo PM2",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/OppoPm2_yoghu3.png",
    id: "oppoPm2",
    accentColor: "slategrey",
    eq: {
      60: 6.6,
      150: -2.0,
      400: -1.0,
      1000: -3.4,
      2400: 2.6,
      15000: 7.6,
    },
  },
  jbl: {
    name: "JBL TUNE 120TWS",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005621/JBLtune_c9cfho.png",
    id: "jbl",
    accentColor: "darkgoldenrod",
    eq: {
      60: 4.7,
      150: -0.5,
      400: 1.0,
      1000: 0.3,
      2400: -1.5,
      15000: -14.7,
    },
  },
  sonyFloat: {
    name: "Sony Float Run",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005622/SonyFloat_olxvxb.png",
    id: "sonyFloat",
    accentColor: "dodgerblue",
    eq: {
      60: 18.6,
      150: -0.3,
      400: -6.3,
      1000: 1.7,
      2400: 1.0,
      15000: -12.0,
    },
  },
  sonyDRZ7: {
    name: "Sony DR-Z7",
    img: "https://res.cloudinary.com/dzjflzbxz/image/upload/v1751005622/SonyDRZ7_nxtkhu.png",
    id: "sonyDRZ7",
    accentColor: "limegreen",
    eq: {
      60: 11.6,
      150: -1.4,
      400: 0.5,
      1000: -2.8,
      2400: -5.0,
      15000: 5.9,
    },
  },
};

const frequencyAndLabels = {
  60: "60Hz",
  150: "150Hz",
  400: "400Hz",
  1000: "1kHz",
  2400: "2.4kHz",
  15000: "15kHz",
};

const LineGraph = ({ data, height = 100, width = 300, color = "wheat" }) => {
  if (!data || data.length < 2) return null;

  const maxY = 20;
  const minY = -20;
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
  const isDesktop = window.innerWidth >= 1000;
  const { Queue, setQueue } = useContext(songContext);
  const [frequency, setFrequency] = useState(
    Queue?.effect || defaultFrequency["Flat"]
  );
  const { openElements, open, close, closeOpen } = useContext(HashContext);
  const [presetName, setPresetName] = useState("Flat");
  const [headphone, setHeadphone] = useState(headphoneSettings["_"]);

  const [graphWidth, setGraphWidth] = useState(300);

  if (document.getElementById("audio")) {
    if (document.getElementById("audio").paused) {
      utils.editMeta(`HTh Beats - Effects`);
    }
  }
  const isFlat = (effect = {}) =>
    Object.values(effect).every((gain) => gain === 0);

  useEffect(() => {
    if (!Queue?.effect) return;
    setFrequency(Queue?.effect);
  }, [Queue?.effect]);

  const setFreq = (value, freq, fx) => {
    const newFrequency = {
      ...frequency,
      [freq]: parseInt(value),
    };

    if (!isFlat(newFrequency) && fx !== "none") {
      setQueue({
        type: "AUDIO_FX",
        value: "none",
      });
    }

    setQueue({
      type: "AUDIO_EFFECT",
      value: newFrequency,
    });
  };
  const setEffect = (fx, freq) => {
    if (!isFlat(freq)) {
      setQueue({
        type: "AUDIO_EFFECT",
        value: defaultFrequency["Flat"],
      });
    }
    if (Queue?.fx == fx) {
      setQueue({
        type: "AUDIO_FX",
        value: "none",
      });

      return;
    }
    setQueue({
      type: "AUDIO_FX",
      value: fx,
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
  const detectMatchingHeadphone = (userEQ) => {
    for (const [headId, headData] of Object.entries(headphoneSettings)) {
      const isMatch = Object.keys(headData.eq).every(
        (freq) => userEQ[freq] === headData.eq[freq]
      );
      if (isMatch) return headphoneSettings[headId];
    }
    return headphoneSettings["_"]; // No exact match found
  };

  useEffect(() => {
    const presetName = detectMatchingPreset(frequency);
    const headphone = detectMatchingHeadphone(frequency);
    setPresetName(presetName);
    setHeadphone(headphone);
  }, [frequency]);

  const setPreset = (preset, fx) => {
    const newFrequency = defaultFrequency[preset];

    if (!isFlat(newFrequency) && fx !== "none") {
      setQueue({
        type: "AUDIO_FX",
        value: "none",
      });
    }
    setQueue({
      type: "AUDIO_EFFECT",
      value: newFrequency,
    });
    setPresetName(preset);
  };
  const setHeadset = (id, fx) => {
    const newFrequency = headphoneSettings[id].eq;

    if (!isFlat(newFrequency) && fx !== "none") {
      setQueue({
        type: "AUDIO_FX",
        value: "none",
      });
    }
    setQueue({
      type: "AUDIO_EFFECT",
      value: newFrequency,
    });
    setHeadphone(headphoneSettings[id]);
  };

  useEffect(() => {
    if (!document.getElementById("graphCont")) return;
    const width = document
      .getElementById("graphCont")
      .getBoundingClientRect().width;
    setGraphWidth(width);
  }, []);

  if (!isDesktop && openElements.includes("equalizer")) {
    return (
      <div className="page hiddenScrollbar deskScroll">
        <div className="libraryNav mobo">
          <BackButton />
          <p className="text-center text-white fw-light fs-4">Equalizer</p>
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
                    onInput={(e) =>
                      setFreq(e.target.value, freq, Queue?.fx || "none")
                    }
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
    );
  }

  const getAccentColor = (headphone, fx) => {
    if (fx == "8d") return "tomato";
    if (fx == "slowreverb") return "thistle";
    return headphone?.accentColor || "wheat";
  };

  return (
    <div className="page hiddenScrollbar deskScroll">
      <div className="libraryNav mobo">
        <BackButton />
        <p className="text-center text-white fw-light fs-4">Sound Effects</p>
      </div>
      <div className="effectCont">
        <div>
          <div className="graphCont" id="graphCont">
            <button
              className="iconButton d-flex align-items-center justify-content-between presetBut mt-4"
              onClick={() => open("presets")}
            >
              <p className="text-white">{presetName}</p>
              <ArrowForwardIos
                className="text-white-50"
                style={{ fontSize: "18px" }}
              />
            </button>
            <LineGraph
              data={Object.values(frequency)}
              width={graphWidth}
              color={getAccentColor(headphone, Queue?.fx)}
            />
          </div>
          <div className="fxCont">
            <div
              className="iconButton fxInact  text-center"
              style={{
                backgroundColor:
                  headphone?.accentColor == "wheat"
                    ? ""
                    : headphone?.accentColor,
              }}
            >
              <button
                className="iconButton d-flex align-items-center justify-content-between presetBut "
                onClick={() => open("headphone")}
              >
                <p className="text-white">{headphone.name}</p>
                <ArrowForwardIos
                  className="text-white-50"
                  style={{ fontSize: "16px" }}
                />
              </button>
              <button
                className="iconButton headThumb pb-2"
                onClick={() => open("headphone")}
              >
                <img
                  src={headphone.img}
                  className={headphone.id == "_" ? "imInact" : "thumbAct"}
                />
              </button>
            </div>
            <div className="d-grid">
              <button
                onClick={() => setEffect("8d", frequency)}
                className="text-start iconButton fxInact text-white p-3"
                style={{
                  backgroundColor: Queue?.fx == "8d" ? "tomato" : "",
                }}
              >
                <ThreeDRotationOutlined />
                <p className="mt-2">3D Audio</p>
              </button>
              <button
                onClick={() => setEffect("slowreverb", frequency)}
                className="text-start iconButton fxInact text-white p-3 "
                style={{
                  backgroundColor: Queue?.fx == "slowreverb" ? "thistle" : "",
                }}
              >
                <LeakAddOutlined />
                <p className="mt-2">Slowed & reverb</p>
              </button>
            </div>
          </div>
        </div>
        <div className="w-100">
          <div className="equCont mt-3 desk">
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
                    onInput={(e) =>
                      setFreq(e.target.value, freq, Queue?.fx || "none")
                    }
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
        <div className="graphCont" style={{ marginTop: "10px" }}>
          <button
            className="iconButton d-flex align-items-center justify-content-between presetBut p-3 mobo"
            onClick={() => open("equalizer")}
          >
            <p className="text-white">Advance option</p>
            <Equalizer className="text-white-50" style={{ fontSize: "18px" }} />
          </button>
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
                onClick={() => setPreset(preset, Queue?.fx || "none")}
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
      <OffCanvas
        open={openElements.includes("headphone")}
        dismiss={() => close("headphone")}
      >
        <div className="contextCont">
          <p className="labelText text-center fw-normal">
            Adjust sound to earphones
          </p>
          <hr className="dividerLine" />
          <div>
            {Object.values(headphoneSettings).map((headphoneData, index) => {
              return (
                <div
                  className={`iconButton text-center headCont ${
                    headphoneData.id == headphone.id ? "imAct" : ""
                  }`}
                  key={"headphone " + index}
                >
                  <button
                    className="iconButton headThumb pb-2"
                    onClick={() =>
                      setHeadset(headphoneData.id, Queue?.fx || "none")
                    }
                  >
                    <img src={headphoneData.img} className="imInact" />
                  </button>
                  <button
                    className="iconButton text-center"
                    onClick={() =>
                      setHeadset(headphoneData.id, Queue?.fx || "none")
                    }
                  >
                    <p
                      className={
                        headphoneData.id == headphone.id
                          ? "text-wheat"
                          : "text-white"
                      }
                    >
                      {headphoneData.name}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </OffCanvas>
    </div>
  );
}
