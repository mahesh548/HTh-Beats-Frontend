import utils from "../../../utils";

export default function CreateLibrary({ response }) {
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont ">
        <div className="libraryNav">
          <p className="labelText">Your library</p>
        </div>
        <div className="libraryList px-2">
          {response.map((item) => {
            return (
              <div className="playlistSong albumList">
                <img src={item.image} className="playlistSongImg" />
                <div>
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.title || item.name)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {utils.refineText(`${item.type} `)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
