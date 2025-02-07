import { BottomSheet } from "react-spring-bottom-sheet";
import "../../BottomSheet.css";
import { useState } from "react";
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
  return (
    <BottomSheet
      open={open}
      onDismiss={() => handleDismiss()}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight * 0.5]}
      defaultSnap={({ snapPoints }) => Math.min(...snapPoints)}
    >
      {children}
    </BottomSheet>
  );
}
