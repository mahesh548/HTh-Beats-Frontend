import utils from "../../../utils";

export default function CreateLibrary({ response }) {
  const getSubtitle = (item) => {
    let restText = "";
    if (item.type == "playlist") {
      restText = ` · HTh-Beats`;
    }
    if (item.type == "album" || item.type == "mix") {
      restText = ` · ${item.list_count} songs`;
    }
    if (item.libraryType == "liked" || item.libraryType == "private") {
      restText = ` · Mahesh`;
    }
    if (item.libraryType == "collab") {
      restText = ` · ${item.libraryUserId.length} collab`;
    }

    return utils.refineText(`${utils.capitalLetter(item.type)} ${restText}`);
  };
  return (
    <div className="page hiddenScrollbar" style={{ overflowY: "scroll" }}>
      <div className="libraryCont ">
        <div className="libraryNav">
          <p className="labelText">Your library</p>
        </div>
        <div className="libraryList px-2">
          {response.map((item) => {
            return (
              <div className="playlistSong libraryList">
                <img
                  src={item.image}
                  className="playlistSongImg"
                  style={{
                    borderRadius: item.type == "artist" ? "100%" : "0px",
                  }}
                />
                <div>
                  <p className="thinOneLineText playlistSongTitle">
                    {utils.refineText(item.title || item.name)}
                  </p>
                  <p className="thinOneLineText playlistSongSubTitle">
                    {getSubtitle(item)}
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
