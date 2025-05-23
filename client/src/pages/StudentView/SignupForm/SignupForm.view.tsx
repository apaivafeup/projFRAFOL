import Button from "@components/Button";
import SelectSearch from "@components/SelectSearch";
import { TextInput } from "@components/TextInput";
import { EmailIcon } from "@icons/email";
import { KeyIcon } from "@icons/key";
import { StudentIcon } from "@icons/student";
import { SchoolIcon } from "@icons/school";

interface SignupFormViewProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  classSelection: string;
  setClassSelection: (classSelection: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onAlreadyHaveAccountClick: () => void;
  options: { name: string; value: string }[];
}

function SignupFormView({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  classSelection,
  setClassSelection,
  handleSubmit,
  isLoading,
  onAlreadyHaveAccountClick,
  options,
}: SignupFormViewProps) {
  return (
    <form onSubmit={handleSubmit} className=" items-center flex flex-col">
      <div className="flex flex-col items-center gap-2">
        <TextInput
          icon={<StudentIcon />}
          value={username}
          setValue={setUsername}
          placeholder="Student Number"
        />
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
      <div className="flex mt-2 flex-row items-center gap-2 justify-center">
        <SchoolIcon />
        <SelectSearch
          selection={classSelection}
          handleSelection={setClassSelection}
          options={options}
          placeholder="Select your Class"
        ></SelectSearch>
      </div>
      <label
        rel="stylesheet"
        onClick={onAlreadyHaveAccountClick}
        onMouseOver={(e) => (e.currentTarget.style.cursor = "pointer")}
        className="text-blue-500 underline line-height-1 mt-2"
      >
        Already have an account? Sign In
      </label>
      <div className="mt-2">
        <Button
          title={"Sign Up"}
          loading={isLoading}
          onClick={() => {}}
          type={"submit"}
        />
      </div>
    </form>
  );
}

export default SignupFormView;
