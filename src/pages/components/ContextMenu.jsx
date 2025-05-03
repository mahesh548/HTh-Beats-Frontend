import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function ContextMenu({ show, onClose, children }) {
  const menuRef = useRef();
  const menuR = useRef();
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.classList.contains("contextMenuPart"))
        setClickPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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

  useLayoutEffect(() => {
    if (show && menuR.current) {
      const menu = menuR.current;
      const { innerWidth, innerHeight } = window;

      const menuRect = menu.getBoundingClientRect();
      let newX = clickPos.x;
      let newY = clickPos.y;

      if (newX + menuRect.width > innerWidth) {
        newX = innerWidth - menuRect.width - 10;
      }

      if (newY + menuRect.height > innerHeight) {
        newY = innerHeight - menuRect.height - 10;
      }

      if (newX !== clickPos.x || newY !== clickPos.y) {
        menuR.current.style.top = `${newY}px`;
        menuR.current.style.left = `${newX}px`;
      }
    }
  }, [show, clickPos]);
  if (!show) return null;
  return createPortal(
    <div className="context-menu-backdrop contextMenuPart" onClick={onClose}>
      <div
        className="context-menu-container fade-in contextMenuPart"
        onClick={(e) => e.stopPropagation()}
        ref={menuR}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
