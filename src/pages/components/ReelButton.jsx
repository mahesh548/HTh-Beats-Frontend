export default function ReelButton({ data, open }) {
  if (!data) return <></>;

  return (
    <button className="iconButton reelButton" onClick={() => open()}>
      <img src={data?.image} />
    </button>
  );
}
