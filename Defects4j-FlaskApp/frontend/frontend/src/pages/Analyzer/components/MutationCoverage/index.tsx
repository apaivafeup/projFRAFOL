import { useCallback, useEffect, useRef, useState } from "react";
import { CoverageCard } from "@components/CoverageCard";
import { useCurrentProject } from "@context/currentProject";
import { Defects4GuiApiService } from "@services/Defects4GuiApi";
import CodeMirror from "@uiw/react-codemirror";
import { abyss } from "@uiw/codemirror-themes-all";

import { basicSetup } from "codemirror";
import { ButtonLoader } from "@components/ButtonLoader";
import CurrentProjectHeader from "@components/CurrentProjectHeader";
import { useSnackbar } from "@context/snackbar";

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
  const {showSnackbar} = useSnackbar();

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
      setCompilationMessage("");
      showSnackbar("Please wait while we setup the project's mutants", "success");
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
      } catch (error) {
        setCompilationMessage(error.message);
      } finally {
        setIsMutating(false);
      }
    };

    performFirstMutation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentProjectFirstMutationComplete, isMutating]);

  return (
    <>
      <CurrentProjectHeader />
      <div className=" grid md:grid-cols-3 gap-4 mt-4">
        <CoverageCard
          title="Code Coverage"
          coverage={Number(currentProject?.metricData[4])}
          ratio={`${currentProject?.metricData[1]}/${currentProject?.metricData[0]}`}
        />
        <CoverageCard
          title="Condition Coverage"
          coverage={Number(currentProject?.metricData[5])}
          ratio={`${currentProject?.metricData[3]}/${currentProject?.metricData[2]}`}
        />

        <CoverageCard
          title="Mutation"
          coverage={Number(currentProject?.mutationSummaryData[3])}
          ratio={`${currentProject?.mutationSummaryData[1]}/${currentProject?.mutationSummaryData[0]} \n Live: ${currentProject?.mutationSummaryData[2]}`}
        />
      </div>
      <div className="mt-4 gap-2 flex flex-col">
        <div className="flex flex-row gap-2">
          <button
            className={`mt-2 ${isMutateButtonDisabled ? "bg-gray-200" : "bg-blue-500"} hover:${isMutateButtonDisabled ? "bg-gray-300" : "bg-blue-700"} text-white font-bold py-2 px-4 rounded`}
            onClick={handleMutate}
            disabled={isMutateButtonDisabled}
            title={`${isMutateButtonDisabled ? "Please, compile student code first" : ""}`}
          >
            {isMutating ? <ButtonLoader /> : "Mutate"}
          </button>
          <button
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCompile}
          >
            {isCompiling ? <ButtonLoader /> : "Compile"}
          </button>
        </div>
        {compilationMessage && (
          <CodeMirror
            value={compilationMessage}
            height="120"
            extensions={[abyss, basicSetup]}
            basicSetup={{ lineNumbers: true }}
            editable={false}
          />
        )}
      </div>
    </>
  );
};
