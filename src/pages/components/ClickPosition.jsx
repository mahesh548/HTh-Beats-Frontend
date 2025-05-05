const lastClick = { x: 0, y: 0 };
export function setClick(e) {
  if (!e.target.classList.contains("contextMenuPart")) {
    lastClick.x = e.clientX;
    lastClick.y = e.clientY;
  }
}
export function getClick() {
  return lastClick;
}
