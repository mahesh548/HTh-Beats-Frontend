import BackButton from "./BackButton";

export default function EditPlaylist({ data }) {
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
