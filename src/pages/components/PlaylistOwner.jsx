import utils from "../../../utils";

export default function PlaylistOwner({
  srcArray,
  label,
  name,
  action,
  totalOwner,
}) {
  return (
    <button
      className="playlistOwner"
      onClick={() => action()}
      style={{ gridTemplateColumns: `${srcArray.length * 20}px auto` }}
    >
      <div className="ownerAvt">
        {srcArray.map((src) => (
          <img
            src={src}
            key={`ownerAvt_${Math.random().toString(36).substr(2, 9)}`}
          />
        ))}
      </div>
      <div className="ownerTxt">
        <b>{label}</b>
        <div>
          <p className="thinOneLineText">{utils.refineText(name)}...</p>
        </div>

        {totalOwner != 1 && <span>+{totalOwner - 1} more</span>}
      </div>
    </button>
  );
}
