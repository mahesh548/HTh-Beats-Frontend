import BackButton from "./BackButton";

export default function EditPlaylist({ id }) {
  return (
    <div className="floatingPage">
      <div className="editCont">
        <div className="navbarAddTo">
          <BackButton />
          <p>Edit playlist</p>
          <button className="iconButton text-wheat">Save</button>
        </div>
      </div>
    </div>
  );
}
