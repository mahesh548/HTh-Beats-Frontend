import { BottomSheet } from "react-spring-bottom-sheet";
import "../../BottomSheet.css";
export default function OffCanvas({ children, open, dismiss }) {
  return (
    <BottomSheet
      open={open}
      onDismiss={() => dismiss()}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight * 0.5]}
      defaultSnap={({ snapPoints }) => Math.min(...snapPoints)}
    >
      {children}
    </BottomSheet>
  );
}
