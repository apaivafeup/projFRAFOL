import React, { useCallback } from "react";
import LoginFormView from "./LoginForm.view";
import { useAuth } from "@context/auth";
import { useSnackbar } from "@context/snackbar";
import { useNavigate } from "react-router";

interface LoginFormProps {
  setIsLoginSelected: (isLoginSelected: boolean) => void;
}

function LoginForm({ setIsLoginSelected }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { signIn } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();
      if (!email || !password) {
        showSnackbar(
          "Please input login information and select your class",
          "error",
        );
        return;
      }
      try {
        setIsLoading(true);
        const user = await signIn(email, password);
        const studentNumber = user?.user.displayName;
        if (!studentNumber) {
          throw new Error("Student number not found");
        }
        navigate("/student/submission");
      } catch (e) {
        showSnackbar("" + e, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate, password, showSnackbar, signIn],
  );
  return (
    <LoginFormView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onDontHaveAccountClick={() => setIsLoginSelected(false)}
      handleSubmit={handleLogin}
      isLoading={isLoading}
    />
  );
}

export default LoginForm;
