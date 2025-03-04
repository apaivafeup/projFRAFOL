import ProjectPicker from "../ProjectPicker";
import MutantKillMap from "./MatrixType/MutantKillMap";
import MutantLeaderboard from "./MatrixType/MutantLeaderboard";
import MatrixTypePicker from "./MatrixTypePicker";
import { useState } from "react";

function MutantMatrixView() {
  const [currentMatrixType, setCurrentMatrixType] = useState<
    "mutant" | "leaderboard" | string
  >("mutant");

  return (
    <div className="flex flex-col h-screen w-full p-1 gap-1">
      <div className="flex flex-row gap-2">
        <ProjectPicker />
        <MatrixTypePicker
          currentMatrixType={currentMatrixType}
          setCurrentMatrixType={setCurrentMatrixType}
        />
      </div>
      <div className="flex flex-col w-full h-full items-center justify-center">
        {currentMatrixType === "mutant" ? (
          <MutantKillMap />
        ) : (
          <MutantLeaderboard />
        )}
      </div>
    </div>
  );
}

export default MutantMatrixView;
