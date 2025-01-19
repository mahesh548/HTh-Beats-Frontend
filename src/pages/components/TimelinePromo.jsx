export default function TimelinePromo({ promo }) {
  const homeCache = JSON.parse(localStorage.homeCache);

  const promoElements = Object.keys(promo).map((key) => {
    const data = promo[key];
    const { type } = data[0];
    const language = data[0]?.more_info?.editorial_language;
    const { title } = homeCache?.modules[key];
    return (
      <div className="promoContainer">
        <div>
          <p className="promoTitle">{title}</p>
          <p className="thinTwoLineText promoSubtitle">
            {type}
            {language ? ` • ${language}` : " • hindi"}
          </p>
        </div>
        <div></div>
      </div>
    );
  });
  return promoElements;
}
