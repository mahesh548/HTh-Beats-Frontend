export default function TimelineSlider({ children, label }) {
  return (
    <>
      <p className="labelText">{label}</p>
      <div className="sliderContainer hiddenScrollbar">
        <div className="slider">{children}</div>
      </div>
    </>
  );
}
