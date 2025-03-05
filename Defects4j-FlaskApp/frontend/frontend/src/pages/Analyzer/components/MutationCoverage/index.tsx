import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentProject } from "@context/currentProject";
import { Defects4GuiApiService } from "@services/Defects4GuiApi";

import { useSnackbar } from "@context/snackbar";
import MutationCoverageView from "./MutationCoverage.view";

const COMPILATION_SUCCESS = "Compilation succeeded.";

export const MutationCoverage: React.FC = () => {
  const [compilationMessage, setCompilationMessage] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const hasRun = useRef(false);

  const {
    currentProject,
    studentCode,
    savePartialProject,
    isMutating,
    setIsMutating,
    isMutateButtonDisabled,
    setIsMutateButtonDisabled,
    isCurrentProjectFirstMutationComplete,
    setIsCurrentProjectFirstMutationComplete,
    setJumpToLineNumberOnClassUnderMutation,
  } = useCurrentProject();
  const { showSnackbar } = useSnackbar();

  const apiService = useRef(new Defects4GuiApiService()).current;

  const handleCompile = useCallback(async () => {
    if (!currentProject) return;
    setCompilationMessage("");
    setIsCompiling(true);
    const { message } = await apiService.compileStudentCode(
      currentProject.name,
      studentCode,
    );
    if (message === COMPILATION_SUCCESS) {
      setIsMutateButtonDisabled(false);
    }
    setIsCompiling(false);
    setCompilationMessage(message);
  }, [apiService, currentProject, setIsMutateButtonDisabled, studentCode]);

  const handleMutate = useCallback(async () => {
    if (!currentProject) return;
    setCompilationMessage("");
    setIsMutating(true);
    try {
      savePartialProject(
        await apiService.analyzeProjectMutants(
          currentProject.name,
          currentProject.mutationTool,
          studentCode,
        ),
      );
    } catch (error) {
      setCompilationMessage((error as Error).message);
    } finally {
      setIsMutating(false);
    }
  }, [
    apiService,
    currentProject,
    savePartialProject,
    setIsMutating,
    studentCode,
  ]);

  useEffect(() => {
    setJumpToLineNumberOnClassUnderMutation(0);
  }, [setJumpToLineNumberOnClassUnderMutation]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (isCurrentProjectFirstMutationComplete || isMutating) return;

    const performFirstMutation = async () => {
      if (!currentProject) return;
      showSnackbar(
        "Please wait while we setup the project's mutants",
        "success",
      );
      setIsMutating(true);
      try {
        savePartialProject(
          await apiService.analyzeProjectMutants(
            currentProject.name,
            currentProject.mutationTool,
            studentCode,
            false,
          ),
        );
        setIsCurrentProjectFirstMutationComplete(true);
      } catch {
        showSnackbar("First mutation analysis already complete", "success");
      } finally {
        setIsMutating(false);
      }
    };

    performFirstMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentProjectFirstMutationComplete, isMutating]);

  return (
    <MutationCoverageView
      compilationMessage={compilationMessage}
      isCompiling={isCompiling}
      isMutating={isMutating}
      isMutateButtonDisabled={isMutateButtonDisabled}
      currentProject={currentProject}
      handleMutate={handleMutate}
      handleCompile={handleCompile}
    />
  );
};
