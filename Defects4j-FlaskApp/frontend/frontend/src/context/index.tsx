/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from "react";
import { CurrentProjectProvider, useCurrentProject } from "./currentProject";
import { AuthContextProvider } from "./auth";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <AuthContextProvider>
      <CurrentProjectProvider>{children}</CurrentProjectProvider>
    </AuthContextProvider>
  );
};

export { useCurrentProject };
