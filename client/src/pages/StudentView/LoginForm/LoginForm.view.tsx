import Button from "@components/Button";
import { TextInput } from "@components/TextInput";
import { EmailIcon } from "@icons/email";
import { KeyIcon } from "@icons/key";

interface LoginFormViewProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onDontHaveAccountClick: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

function LoginFormView({
  email,
  setEmail,
  password,
  setPassword,
  onDontHaveAccountClick,
  handleSubmit,
  isLoading,
}: LoginFormViewProps) {
  return (
    <form onSubmit={handleSubmit} className=" items-center flex flex-col">
      <div className="flex flex-col items-center gap-2">
        <TextInput
          icon={<EmailIcon />}
          value={email}
          setValue={setEmail}
          placeholder="Student Email"
        />
        <TextInput
          icon={<KeyIcon />}
          value={password}
          setValue={setPassword}
          placeholder="Password"
        />
      </div>
      <label
        rel="stylesheet"
        onClick={onDontHaveAccountClick}
        onMouseOver={(e) => (e.currentTarget.style.cursor = "pointer")}
        className="text-blue-500 underline line-height-1 mt-2"
      >
        Don't have an account? Sign Up
      </label>
      <div className="mt-2">
        <Button
          title={"Login"}
          loading={isLoading}
          onClick={() => {}}
          type={"submit"}
        />
      </div>
    </form>
  );
}

export default LoginFormView;
