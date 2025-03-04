import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

export type Route =
  | "select-project"
  | "analyzer"
  | "kill-matrix"
  | "leaderboard"
  | "teacher"
  | "student";

export interface NavbarContextProps {
  currentRoute: string;
  setCurrentRoute: (route: Route) => void;
}

const NavbarContext = createContext<NavbarContextProps | null>(null);

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentRoute, setCurrentRoute] = useState<Route>("select-project");



  return (
    <NavbarContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavbar = (): NavbarContextProps => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error(
        "useNavbar must be used within a NavbarProvider",
    );
  }
  return context;
};
