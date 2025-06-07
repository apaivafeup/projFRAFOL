import React, { useCallback, useEffect } from "react";
import ScreenHero from "../../components/ScreenHero/ScreenHero.view";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router";
import { useSnackbar } from "@context/snackbar";
import Button from "@components/Button";
import { TextInput } from "@components/TextInput";
import { EmailIcon } from "@icons/email";
import { KeyIcon } from "@icons/key";

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
        <TextInput
          icon={<EmailIcon />}
          value={username}
          setValue={setUsername}
          placeholder="Email"
        />
        <div className="mt-2">
          <TextInput
            icon={<KeyIcon />}
            value={password}
            setValue={setPassword}
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="mt-4 items-center justify-center flex flex-col">
          <Button
            title={"Login"}
            loading={isLoading}
            onClick={() => { }}
            type={"submit"}
          ></Button>
        </div>
      </form>
    </div>
  );
}

export default TeacherView;
