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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name
              )}&bold=true&background=f5deb3&length=1&font-size=0.6`;
            }}
          />
        ))}
      </div>
      <div className="ownerTxt">
        <b>{label}</b>
        <div>
          <p className="thinOneLineText">{utils.refineText(name)}</p>
        </div>

        {totalOwner > 3 && <span>+{totalOwner - 3} more</span>}
      </div>
    </button>
  );
}
