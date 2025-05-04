import { BottomSheet } from "react-spring-bottom-sheet";
import "../../BottomSheet.css";
import { useState, useEffect } from "react";
import ContextMenu from "./ContextMenu";
export default function OffCanvas({ children, open, dismiss }) {
  const [isDis, setIsDis] = useState(false);

  const handleDismiss = () => {
    if (isDis) return;
    setIsDis(true);
    dismiss();
    setTimeout(() => {
      setIsDis(false);
    }, 400);
  };
  const isDesktop = window.innerWidth >= 1000;
  return isDesktop ? (
    <ContextMenu show={open} onClose={() => handleDismiss()}>
      {children}
    </ContextMenu>
  ) : (
    <BottomSheet
      open={open}
      onDismiss={() => handleDismiss()}
      snapPoints={({ minHeight, maxHeight }) => {
        return [minHeight + 50, maxHeight];
      }}
      defaultSnap={({ snapPoints }) => {
        return Math.min(...snapPoints);
      }}
    >
      {children}
    </BottomSheet>
  );
}
