import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { isAdmittedStudent } from "../services/Firebase";
import { useAuth } from "./auth";

export interface StudentContextProps {
  currentStudentNumber: string;
  setCurrentStudentNumber: (studentNumber: string) => void;
  currentClassName: string;
  setCurrentClassName: Dispatch<SetStateAction<string>>;
  isAdmitted: boolean;
}

const StudentContext = createContext<StudentContextProps | null>(null);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStudentNumber, setCurrentStudentNumber] = useState<string>("");
  const [currentClassName, setCurrentClassName] = useState<string>("");
  const [isAdmitted, setIsAdmitted] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIsAdmitted = async () => {
      if (!user) return false;
      const studentClass = user.photoURL;
      console.log("studentClass", studentClass);
      return await isAdmittedStudent(user.displayName, studentClass);
    };
    fetchIsAdmitted().then((result) => setIsAdmitted(result));
  }, [currentStudentNumber, currentClassName, user]);

  return (
    <StudentContext.Provider
      value={{
        currentStudentNumber,
        setCurrentStudentNumber,
        currentClassName,
        setCurrentClassName,
        isAdmitted,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudent = (): StudentContextProps => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
