import Button from "@components/Button";

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
      <div className="flex flex-col items-center gap-2 text-lg">
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
