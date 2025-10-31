import { useEffect, useMemo, useState } from "react";

export default function Lyrics({ data }) {
  const [currentLine, setCurrentLine] = useState(null);

  const isInView = (element) => {
    const container = document.getElementById("lyricsCont");
    if (!element || !container) return false;

    const elemRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
      elemRect.top >= containerRect.top &&
      elemRect.bottom <= containerRect.bottom
    );
  };

  const lrcToObject = (lrcText) => {
    const lines = lrcText.split("\n");
    const lyricsObj = {};

    const hasTimestamp = /^\[\d{2}:\d{2}\.\d{2}\]/.test(lines[0]);

    if (!hasTimestamp) {
      const allLyrics = lines
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");
      lyricsObj[0] = allLyrics;
      return lyricsObj;
    }
    for (let line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const totalSeconds = Math.floor(minutes * 60 + seconds);
        const lyric = match[3].trim();
        if (lyric) lyricsObj[totalSeconds] = lyric;
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

  useEffect(() => {
    const activeLine = document.getElementsByClassName("activeLyrics");
    if (activeLine.length > 0) {
      const currentElement = activeLine[activeLine.length - 1];
      if (isInView(currentElement)) {
        currentElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentLine]);

  return (
    <>
      {Object.entries(lyricsData).map(([time, line], index) => {
        if (line.length == 0) {
          return <div key={"lyrics-line-" + index} className="mt-4 mb-2"></div>;
        }
        return (
          <p
            key={"lyrics-line-" + index}
            className={`${
              Number(time) <= Number(currentLine)
                ? "text-white activeLyrics"
                : "text-black"
            }  fw-normal mt-2 mb-2 px-2 ps-3 lyricalText`}
            id={`${Number(time) == Number(currentLine) ? "currentLine" : ""}`}
            style={{ whiteSpace: "pre-line" }}
          >
            {line}
          </p>
        );
      })}
    </>
  );
}
