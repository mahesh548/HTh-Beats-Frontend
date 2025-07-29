export default function Video({ src, thumbSrc, styleClass = "" }) {
  let videoSrc = "";
  if (src.endsWith(".mp4")) {
    videoSrc = src;
  } else if (src.endsWith("_master")) {
    videoSrc = src.replace("_master", "_540p_sas_cw.mp4");
  }
  return (
    <video
      src={videoSrc}
      autoPlay={true}
      loop={true}
      muted={true}
      controls={false}
      className={"videoTag " + styleClass}
      poster={thumbSrc}
    ></video>
  );
}
