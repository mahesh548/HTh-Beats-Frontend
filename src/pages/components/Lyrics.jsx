import { useEffect, useMemo, useState } from "react";

export default function Lyrics({ data }) {
  const [currentLine, setCurrentLine] = useState(null);

  const lrcToObject = (lrcText) => {
    const lines = lrcText.split("\n");
    const lyricsObj = {};
    for (let line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const totalSeconds = Math.floor(minutes * 60 + seconds);
        const lyric = match[3].trim();

        if (lyric) {
          lyricsObj[totalSeconds] = lyric;
        }
      }
    }
    return lyricsObj;
  };

  const lyricsData = useMemo(() => lrcToObject(data), [data]);

  useEffect(() => {
    const audio = document.getElementById("audio");
    const timestamps = Object.keys(lyricsData);
    let initialTime = "";
    timestamps.some((val) => {
      if (Number(val) <= audio.currentTime) {
        initialTime = val;
      } else {
        setCurrentLine(initialTime);
        return true;
      }
    });
    const updater = () => {
      const time = String(Math.floor(audio.currentTime));
      if (timestamps.includes(time)) {
        setCurrentLine(time);
      }
    };

    audio.addEventListener("timeupdate", updater);

    return () => {
      audio.removeEventListener("timeupdate", updater);
    };
  }, [lyricsData]);

  return (
    <>
      {Object.entries(lyricsData).map(([time, line], index) => {
        if (line.length == 0) {
          return <div key={"lyrics-line-" + index} className="mt-4 mb-2"></div>;
        }
        return (
          <p
            key={"lyrics-line-" + index}
            className={`text-white${
              time == currentLine ? "" : "-50"
            }  fw-normal mt-2 mb-2 px-2 ps-3 lyricalText`}
          >
            {line}
          </p>
        );
      })}
    </>
  );
}
