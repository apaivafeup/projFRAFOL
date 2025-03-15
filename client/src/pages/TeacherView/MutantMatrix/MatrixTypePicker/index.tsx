import { useMemo } from "react";
import MatrixTypePickerView from "./MatrixTypePicker.view";

interface MatrixTypePickerProps {
  currentMatrixType: string;
  setCurrentMatrixType: (matrixType: string) => void;
}

function MatrixTypePicker({
  currentMatrixType,
  setCurrentMatrixType,
}: MatrixTypePickerProps) {
  const matrixTypes = useMemo(() => {
    return [
      { name: "Mutant Kill Map", value: "mutant" },
      { name: "Mutant Number Leaderboard", value: "leaderboard" },
    ];
  }, []);
  return (
    <MatrixTypePickerView
      matrixType={currentMatrixType}
      setMatrixType={setCurrentMatrixType}
      types={matrixTypes}
    />
  );
}

export default MatrixTypePicker;
