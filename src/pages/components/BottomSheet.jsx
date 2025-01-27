import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
export default function OffCanvas({ children, open, setOpen }) {
  return (
    <BottomSheet
      open={open}
      onDismiss={() => setOpen(false)}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight * 0.5]}
      defaultSnap={({ snapPoints }) => Math.min(...snapPoints)}
    >
      {children}
    </BottomSheet>
  );
}
