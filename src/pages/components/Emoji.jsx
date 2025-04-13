import { useState, useEffect, useRef } from "react";

export default function Emoji({
  src = "",
  imageStyleClass = "",
  loaderStyleClass = "",
  click,
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setLoaded(false);

    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      // Image loaded from cache
      setLoaded(true);
    }
  }, [src]);

  return (
    <>
      {!loaded && <div className={`skeleton ${loaderStyleClass}`}></div>}

      <img
        ref={imgRef}
        src={src}
        className={imageStyleClass}
        onLoad={() => setLoaded(true)}
        onClick={click}
        style={{ display: loaded ? "block" : "none" }}
      />
    </>
  );
}
