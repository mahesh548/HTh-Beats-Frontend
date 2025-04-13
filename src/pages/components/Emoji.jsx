import { useState, useEffect } from "react";

export default function Emoji({
  src = "",
  imageStyleClass = "",
  loaderStyleClass = "",
  click,
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <>
      {!loaded && <div className={`skeleton ${loaderStyleClass}`}></div>}

      <img
        src={src}
        className={imageStyleClass}
        onLoad={() => setLoaded(true)}
        onClick={click}
        style={{ display: loaded ? "block" : "none" }}
      />
    </>
  );
}
