import { useState } from "react";

export default function Emoji({
  src = "",
  imageStyleClass = "",
  loaderStyleClass = "",
  click,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <div className={`skeleton ${loaderStyleClass}`}></div>}

      <img
        src={src}
        className={imageStyleClass}
        onLoad={() => setLoaded(true)}
        onClick={() => click}
        style={{ display: loaded ? "block" : "none" }}
      />
    </>
  );
}
