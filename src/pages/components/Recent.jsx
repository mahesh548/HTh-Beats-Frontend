import utils from "../../../utils";

export default function Recent({ recentData }) {
  console.log("recentData", recentData);
  recentData = recentData.filter((item) => item.data);
  recentData = recentData.map((item) => item.data);
  const data =
    recentData.length % 2 == 0
      ? recentData
      : recentData.slice(0, recentData.length - 1);

  console.log("recentData", recentData);

  return (
    <div className="songArtCont">
      {data.map((item, index) => {
        return (
          <div key={`recent_${index}`} className="recentChip">
            <img src={item.image} />
            <p className="thinTwoLineText">
              {utils.refineText(item?.name || item?.title)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
