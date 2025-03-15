import { Alert, Snackbar } from "@mui/material";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type SnackbarType = "success" | "error" | "warning" | "info";
type Snackbar = {
  message: string;
  type: SnackbarType;
};
export interface SnackbarContextProps {
  showSnackbar: (message: string, type: SnackbarType) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextProps | null>(null);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<Snackbar>({
    message: "",
    type: "success",
  });

  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, type: SnackbarType) => {
    setSnackbar({ message, type });
    setSnackbarOpen(true);
  };

  useEffect(() => {}, []);

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        hideSnackbar,
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={hideSnackbar}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useCurrentProject must be used within a CurrentProjectProvider",
    );
  }
  return context;
};
