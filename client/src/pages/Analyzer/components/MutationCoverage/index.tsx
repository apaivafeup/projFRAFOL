import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentProject } from "@context/currentProject";
import { Defects4GuiApiService } from "@services/Defects4GuiApi";

import { useSnackbar } from "@context/snackbar";
import MutationCoverageView from "./MutationCoverage.view";
import { isTestSuiteEmpty } from "@utils/index";

const COMPILATION_SUCCESS = "Compilation succeeded.";

export const MutationCoverage: React.FC = () => {
  const [compilationMessage, setCompilationMessage] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isUpdatingCoverage, setIsUpdatingCoverage] = useState<boolean>(false);

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

  const handleCoverage = useCallback(async () => {
    if (!currentProject) return;

    setIsUpdatingCoverage(true);
    try {
      const coverageData = await apiService.getCoverage(
        currentProject.name,
        studentCode,
      );

      savePartialProject(coverageData);
      showSnackbar("Project coverage has been updated", "success");
    } catch (error) {
      setCompilationMessage((error as Error).message);
    } finally {
      setIsUpdatingCoverage(false);
    }
  }, [
    apiService,
    currentProject,
    savePartialProject,
    showSnackbar,
    studentCode,
  ]);

  const resetMutationScores = useCallback(() => {
    if (!currentProject?.snapshot) {
      return;
    }
    savePartialProject(currentProject.snapshot);
  }, [currentProject, savePartialProject]);

  const handleMutate = useCallback(async () => {
    if (!currentProject) return;
    setCompilationMessage("");
    setIsMutating(true);

    const isEmpty = isTestSuiteEmpty(studentCode);

    if (isEmpty) {
      resetMutationScores();
      return;
    }

    try {
      savePartialProject(
        await apiService.analyzeProjectMutants(
          currentProject.name,
          currentProject.mutationTool,
          studentCode,
          !isEmpty,
          isEmpty,
        ),
      );
      showSnackbar("Mutants have been generated successfully", "success");
    } catch (error) {
      setCompilationMessage((error as Error).message);
    } finally {
      setIsMutating(false);
    }
  }, [
    apiService,
    currentProject,
    resetMutationScores,
    savePartialProject,
    setIsMutating,
    showSnackbar,
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
        const mutantInformation = await apiService.analyzeProjectMutants(
          currentProject.name,
          currentProject.mutationTool,
          studentCode,
          false,
        );
        savePartialProject({
          ...mutantInformation,
          snapshot: mutantInformation,
        });
        showSnackbar("Mutants have been generated successfully", "success");
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
      isUpdatingCoverage={isUpdatingCoverage}
      currentProject={currentProject}
      handleMutate={handleMutate}
      handleCompile={handleCompile}
      handleCoverage={handleCoverage}
    />
  );
};
