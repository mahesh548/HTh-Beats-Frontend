import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getClick } from "./ClickPosition";

export default function ContextMenu({ show, onClose, children }) {
  const menuRef = useRef();
  const menuR = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  useEffect(() => {
    if (show && menuR.current) {
      const menu = menuR.current;
      const { innerWidth, innerHeight } = window;

      const menuRect = menu.getBoundingClientRect();
      let newX = getClick().x;
      let newY = getClick().y;

      if (newX + menuRect.width > innerWidth) {
        newX = innerWidth - menuRect.width - 10;
      }

      if (newY + menuRect.height > innerHeight) {
        newY = innerHeight - menuRect.height - 10;
      }

      menuR.current.style.top = `${newY}px`;
      menuR.current.style.left = `${newX}px`;
    }
  }, [show, getClick]);

  if (!show) return null;
  return createPortal(
    <div className="context-menu-backdrop contextMenuPart" onClick={onClose}>
      <div
        className="context-menu-container fade-in contextMenuPart hiddenScrollbar deskScroll"
        onClick={(e) => e.stopPropagation()}
        ref={menuR}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
