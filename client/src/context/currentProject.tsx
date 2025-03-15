import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { MutationTools, ProjectType } from "../utils";

type TestName = string;
type MutantId = string;
type MutantsKilledByTest = MutantId[];
export interface Project {
  name: ProjectType;
  mutationTool: MutationTools;
  mutantTableHeaders: string[];
  mutantSheetData: [][]; // You might want to specify the type of the inner arrays more precisely
  metricData: string[];
  mutationSummaryData: string[] | number[];
  testClass: string;
  devSuite: string;
  killedMutants: MutantId[];
  coverageData: Record<"green" | "yellow" | "red", Array<number>>;
  killMatrix: Record<TestName, MutantsKilledByTest>;
  killMatrixHeaders: string[];
}

export interface CurrentProjectContextProps {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  studentCode: string;
  setStudentCode: (code: string) => void;
  savePartialProject: (project: Partial<Project>) => void;
  excludeKilledMutants: boolean;
  setExcludeKilledMutants: (exclude: boolean) => void;
  jumpToLineNumberOnClassUnderMutation: number | undefined;
  setJumpToLineNumberOnClassUnderMutation: (
    lineNumber: number | undefined,
  ) => void;
  isMutating: boolean;
  setIsMutating: (isMutating: boolean) => void;
  isMutateButtonDisabled: boolean;
  setIsMutateButtonDisabled: (isDisabled: boolean) => void;
  openProject: (project: Project) => void;
  isCurrentProjectFirstMutationComplete: boolean;
  setIsCurrentProjectFirstMutationComplete: (
    isFirstMutationComplete: boolean,
  ) => void;
  isGeneratingKillMatrix: boolean;
  setIsGeneratingKillMatrix: (isGenerating: boolean) => void;
}

const CurrentProjectContext = createContext<CurrentProjectContextProps | null>(
  null,
);

export const CurrentProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [studentCode, _setStudentCode] = useState<string>("");
  const [excludeKilledMutants, setExcludeKilledMutants] =
    useState<boolean>(false);
  const [
    jumpToLineNumberOnClassUnderMutation,
    setJumpToLineNumberOnClassUnderMutation,
  ] = useState<number | undefined>(undefined);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isGeneratingKillMatrix, setIsGeneratingKillMatrix] =
    useState<boolean>(false);
  const [isMutateButtonDisabled, setIsMutateButtonDisabled] =
    useState<boolean>(false);
  const [
    isCurrentProjectFirstMutationComplete,
    setIsCurrentProjectFirstMutationComplete,
  ] = useState<boolean>(false);

  const projectCacheName = useMemo(() => {
    return currentProject
      ? currentProject.name + "-" + currentProject.mutationTool
      : "";
  }, [currentProject]);

  const setStudentCode = useCallback(
    (code: string) => {
      _setStudentCode(code);
      if (isMutateButtonDisabled) {
        return;
      }
      setIsMutateButtonDisabled(true);
    },
    [isMutateButtonDisabled],
  );

  const savePartialProject = useCallback((project: Partial<Project>) => {
    setCurrentProject((currentProject) =>
      currentProject
        ? {
            ...currentProject,
            ...project,
          }
        : null,
    );
  }, []);

  const setStudentCodeFromCache = useCallback((code: string) => {
    if (!code) {
      fetch("testClasses/StudentTest.java")
        .then((response) => response.text())
        .then((javaCode) => _setStudentCode(javaCode))
        .catch((error) => console.error("Error loading Java file:", error));
      return;
    }
    _setStudentCode(code);
  }, []);

  const setDefaultStudentCode = useCallback(() => {
    fetch("testClasses/StudentTest.java")
      .then((response) => response.text())
      .then((javaCode) => _setStudentCode(javaCode))
      .catch((error) => console.error("Error loading Java file:", error));
  }, []);

  const openProject = useCallback(
    (project: Project) => {
      const storedProject = localStorage.getItem(
        project.name + "-" + project.mutationTool,
      );
      if (storedProject) {
        const parsedProject = JSON.parse(storedProject);
        _setStudentCode(parsedProject.studentCode);
        delete parsedProject.studentCode;
        setCurrentProject(parsedProject);
        return;
      }
      setDefaultStudentCode();
      setCurrentProject(project);
    },
    [setDefaultStudentCode],
  );

  useEffect(() => {
    if (!currentProject) {
      return;
    }

    const projectWithStudentCode = {
      ...currentProject,
      studentCode,
    };
    localStorage.setItem(
      projectCacheName,
      JSON.stringify(projectWithStudentCode),
    );
  }, [currentProject, projectCacheName, studentCode]);

  useEffect(() => {
    async function fetchStoredProject() {
      const storedProjectName = localStorage.getItem("currentProjectName");
      if (storedProjectName) {
        const storedProject = localStorage.getItem(storedProjectName);
        if (storedProject) {
          const parsedProject = await JSON.parse(storedProject);
          setStudentCodeFromCache(parsedProject.studentCode);
          delete parsedProject.studentCode;
          setCurrentProject(parsedProject);
        }
      }
    }
    fetchStoredProject();
  }, [setStudentCodeFromCache]);

  useEffect(() => {
    if (projectCacheName) {
      localStorage.setItem("currentProjectName", projectCacheName);
    }
  }, [projectCacheName, studentCode]);

  return (
    <CurrentProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        studentCode,
        setStudentCode,
        savePartialProject,
        excludeKilledMutants,
        setExcludeKilledMutants,
        jumpToLineNumberOnClassUnderMutation,
        setJumpToLineNumberOnClassUnderMutation,
        isMutating,
        setIsMutating,
        isMutateButtonDisabled,
        setIsMutateButtonDisabled,
        openProject,
        isCurrentProjectFirstMutationComplete,
        setIsCurrentProjectFirstMutationComplete,
        isGeneratingKillMatrix,
        setIsGeneratingKillMatrix,
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrentProject = (): CurrentProjectContextProps => {
  const context = useContext(CurrentProjectContext);
  if (!context) {
    throw new Error(
      "useCurrentProject must be used within a CurrentProjectProvider",
    );
  }
  return context;
};
