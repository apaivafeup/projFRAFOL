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

    useEffect (() => {
        const fetchIsAdmitted = async () => {  
    if(!currentStudentNumber || !currentClassName) return false;
      return await isAdmittedStudent(currentStudentNumber, currentClassName);
    }
    fetchIsAdmitted().then((result) => setIsAdmitted(result
    ));
    }, [currentStudentNumber, currentClassName]);


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
