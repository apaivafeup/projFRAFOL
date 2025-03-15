import { useCurrentProject } from "../../context";
import { useCallback, useMemo, useRef, useState } from "react";
import { Defects4GuiApiService } from "../../services/Defects4GuiApi";
import KillMatrixView from "./KillMatrix.view";
import { useSnackbar } from "@context/snackbar";

export const KillMatrix = () => {
  const [openHelp, setOpenHelp] = useState(false);
  const {
    currentProject,
    studentCode,
    savePartialProject,
    isGeneratingKillMatrix,
    setIsGeneratingKillMatrix,
  } = useCurrentProject();
  const apiService = useRef(new Defects4GuiApiService()).current;
  const { showSnackbar } = useSnackbar();

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
      if (!killMatrix || !killMatrixHeaders || !killMatrixHeaders.length) {
        showSnackbar(
          "Error Generating Kill Matrix, check Docker Logs",
          "error",
        );
        return;
      }
      savePartialProject({ killMatrix, killMatrixHeaders });
      showSnackbar("Kill Matrix Generated Successfully", "success");
    } catch {
      showSnackbar("Error Generating Kill Matrix, check Docker Logs", "error");
    } finally {
      setIsGeneratingKillMatrix(false);
    }
  }, [
    apiService,
    currentProject,
    isGeneratingKillMatrix,
    savePartialProject,
    setIsGeneratingKillMatrix,
    showSnackbar,
    studentCode,
  ]);

  return (
    <KillMatrixView
      openHelp={openHelp}
      setOpenHelp={setOpenHelp}
      killMatrixIsNotGenerated={killMatrixIsNotGenerated}
      currentProject={currentProject}
      isGeneratingKillMatrix={isGeneratingKillMatrix}
      handleGenerateKillMatrix={handleGenerateKillMatrix}
    />
  );
};
