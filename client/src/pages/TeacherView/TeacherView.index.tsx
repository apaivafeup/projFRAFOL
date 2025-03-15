import React, { useCallback, useEffect } from "react";
import ScreenHero from "../../components/ScreenHero/ScreenHero.view";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router";
import { useSnackbar } from "@context/snackbar";
import Button from "@components/Button";

function TeacherView() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn, user, isTeacher, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleLogin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setIsLoading(true);
        await signIn(username, password);
      } finally {
        setIsLoading(false);
      }
    },
    [username, password, signIn],
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    if (isTeacher) {
      navigate("/teacher/dashboard");
      return;
    }
  }, [isTeacher, logout, navigate, showSnackbar, user]);
  return (
    <div className="flex flex-col items-center w-full justify-center h-screen">
      <ScreenHero
        icon={faChalkboardTeacher}
        title="Hello Teacher"
        description="Please login to manage information about your class"
      />
      <form onSubmit={handleLogin} className="gap-2 items-center">
        <div className="flex flex-row items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            placeholder="Student Email"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
          />
        </div>
        <div className="flex flex-row items-center gap-2 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
          />
        </div>
        <div className="mt-4 items-center justify-center flex flex-col">
          <Button
            title={"Login"}
            loading={isLoading}
            onClick={() => {}}
            type={"submit"}
          ></Button>
        </div>
      </form>
    </div>
  );
}

export default TeacherView;
