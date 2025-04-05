import utils from "../../../utils";

export default function Recent({ recentData }) {
  recentData = recentData
    .filter((item) => item.data)
    .sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    })
    .map((item) => item.data);
  const data =
    recentData.length % 2 == 0
      ? recentData
      : recentData.slice(0, recentData.length - 1);

  return (
    <div className="recentCont mt-4">
      {data.map((item, index) => {
        return (
          <div key={`recent_${index}`} className="recentChip">
            <img src={item.image} />
            <p className="thinTwoLineText mt-0">
              {utils.refineText(item?.name || item?.title)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
