import { useCurrentProject } from "../../context";
import { useCallback, useMemo, useRef } from "react";
import { Defects4GuiApiService } from "../../services/Defects4GuiApi";
import KillMatrixView from "./KillMatrix.view";

export const KillMatrix = () => {
  const {
    currentProject,
    studentCode,
    savePartialProject,
    isGeneratingKillMatrix,
    setIsGeneratingKillMatrix,
  } = useCurrentProject();
  const apiService = useRef(new Defects4GuiApiService()).current;

  const killMatrixIsNotGenerated = useMemo(() => {
    return (
      !currentProject?.killMatrix ||
      !currentProject?.killMatrixHeaders ||
      !Object.keys(currentProject?.killMatrixHeaders).length
    );
  }, [currentProject?.killMatrix, currentProject?.killMatrixHeaders]);

  const handleGenerateKillMatrix = useCallback(async () => {
    if (!currentProject || isGeneratingKillMatrix) return;
    setIsGeneratingKillMatrix(true);
    try {
      const { killMatrix, killMatrixHeaders } =
        await apiService.generateKillMatrix(
          currentProject.name,
          currentProject.mutationTool,
          studentCode,
        );
      savePartialProject({ killMatrix, killMatrixHeaders });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingKillMatrix(false);
    }
  }, [
    apiService,
    currentProject,
    isGeneratingKillMatrix,
    savePartialProject,
    setIsGeneratingKillMatrix,
    studentCode,
  ]);

  return (
    <KillMatrixView
      killMatrixIsNotGenerated={killMatrixIsNotGenerated}
      currentProject={currentProject}
      isGeneratingKillMatrix={isGeneratingKillMatrix}
      handleGenerateKillMatrix={handleGenerateKillMatrix}
    />
  );
};
