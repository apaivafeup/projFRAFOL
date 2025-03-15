import Button from "@components/Button";
import SelectSearch from "@components/SelectSearch";

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
      <div className="flex flex-col items-center gap-2 text-lg">
        <input
          type="text"
          placeholder="Student Number"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
        />
        <input
          type="text"
          placeholder="Student Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
        />
      </div>
      <div className="flex mt-2 flex-col items-center gap-2 justify-center">
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
