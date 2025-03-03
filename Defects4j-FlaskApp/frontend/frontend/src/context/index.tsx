/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from "react";
import { CurrentProjectProvider, useCurrentProject } from "./currentProject";
import { AuthContextProvider, useAuth } from "./auth";
import { SnackbarProvider } from "./snackbar";
import { TeacherProvider } from "./teacher";
import { StudentProvider } from "./student";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  

  return (
    <AuthContextProvider>
      <StudentProvider>
      <SnackbarProvider>
        <TeacherProvider>
          <CurrentProjectProvider>{children}</CurrentProjectProvider>
        </TeacherProvider>
      </SnackbarProvider>
      </StudentProvider>
    </AuthContextProvider>
  );
};

export { useCurrentProject, useAuth };
