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
    <div className="flex flex-col  p-1 gap-1">
      <div className=" grid grid-cols-1 lg:flex lg:flex-row gap-2">
        <ProjectPicker />
        <MatrixTypePicker
          currentMatrixType={currentMatrixType}
          setCurrentMatrixType={setCurrentMatrixType}
        />
      </div>
      <div className="grid grid-cols-1 h-full mt-4">
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
