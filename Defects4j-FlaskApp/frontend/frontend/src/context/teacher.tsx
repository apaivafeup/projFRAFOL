import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import {
  getAllClasses,
  getClassAdmissions,
  getClassProjects,
  getClassStudents,
  getClassSubmissions,
  StudentSubmission,
} from "../services/Firebase";

type ProjectWithTool = string;

export interface TeacherContextProps {
  currentClassName: string;
  setCurrentClassName: (className: string) => void;
  currentProject: ProjectWithTool | null;
  setCurrentProject: Dispatch<SetStateAction<ProjectWithTool | null>>;
  allClasses: string[];
  refreshClasses: () => void;
  currentClassProjects: ProjectWithTool[] | null;
  currentProjectSubmissions: StudentSubmission[] | null;
  currentClassAdmissions: string[];
  getCurrentClassAdmissions: () => void;
  getCurrentClassStudents: () => void;
  currentClassStudents: string[];
}

const TeacherContext = createContext<TeacherContextProps | null>(null);

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentClassName, setCurrentClassName] = useState<string>("");
  const [currentClassAdmissions, setCurrentClassAdmissions] = useState<
    string[]
  >([]);
  const [currentProject, setCurrentProject] = useState<ProjectWithTool | null>(
    null,
  );
  const [currentClassProjects, setCurrentClassProjects] = useState<
    ProjectWithTool[] | null
  >(null);
  const [currentProjectSubmissions, setCurrentProjectSubmissions] = useState<
    StudentSubmission[] | null
  >(null);
  const [currentClassStudents, setCurrentClassStudents] = useState<string[]>(
    [],
  );

  const [allClasses, setAllClasses] = useState<string[]>([]);

  async function fetchClasses() {
    const classes = await getAllClasses();
    setAllClasses(classes);
  }

  const refreshClasses = async () => {
    await fetchClasses();
  };

  const getCurrentClassProjects = useCallback(async () => {
    if (!currentClassName) return;
    console.log("Fetching projects for class", currentClassName);
    const projects = await getClassProjects(currentClassName);
    console.log("Projects for class", currentClassName, projects);
    setCurrentClassProjects(projects);
  }, [currentClassName]);

  const getCurrentProjectSubmissions = useCallback(async () => {
    if (!currentClassName || !currentProject) return;
    const submissions = await getClassSubmissions(
      currentClassName,
      currentProject,
    );
    setCurrentProjectSubmissions(submissions);
  }, [currentClassName, currentProject]);

  const getCurrentClassAdmissions = useCallback(async () => {
    if (!currentClassName) return;
    const admissions = await getClassAdmissions(currentClassName);
    setCurrentClassAdmissions(admissions);
  }, [currentClassName]);

  const getCurrentClassStudents = useCallback(async () => {
    if (!currentClassName) return;
    const students = await getClassStudents(currentClassName);
    setCurrentClassStudents(students);
  }, [currentClassName]);

  useEffect(() => {
    getCurrentClassProjects();
    getCurrentClassAdmissions();
    getCurrentClassStudents();
  }, [
    getCurrentClassAdmissions,
    getCurrentClassProjects,
    getCurrentClassStudents,
  ]);

  useEffect(() => {
    getCurrentProjectSubmissions();
  }, [getCurrentProjectSubmissions]);

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <TeacherContext.Provider
      value={{
        currentClassName,
        setCurrentClassName,
        allClasses,
        refreshClasses,
        currentClassProjects,
        currentProjectSubmissions,
        currentProject,
        setCurrentProject,
        currentClassAdmissions,
        getCurrentClassAdmissions,
        currentClassStudents,
        getCurrentClassStudents,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTeacher = (): TeacherContextProps => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
};
