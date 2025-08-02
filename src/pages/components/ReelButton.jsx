export default function ReelButton({ data, open }) {
  if (!data) return <></>;
  const primary = data?.more_info?.has_video
    ? data?.more_info?.video_thumbnail
    : data?.image;
  const fallback = data?.image;

  return (
    <button className="iconButton reelButton" onClick={() => open()}>
      <img
        src={primary}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallback;
        }}
      />
    </button>
  );
}
