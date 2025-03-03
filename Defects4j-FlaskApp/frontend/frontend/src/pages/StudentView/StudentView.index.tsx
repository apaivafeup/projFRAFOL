import React, { useCallback, useEffect, useMemo } from "react";
import ScreenHero from "../../components/ScreenHero/ScreenHero.view";
import { faCheck, faFileContract } from "@fortawesome/free-solid-svg-icons";


//import 'react-select-search/style.css'
import "./SelectSearchLight.css";
import { useTeacher } from "../../context/teacher";
import SelectSearch from "../../components/SelectSearch";
import { useSnackbar } from "../../context/snackbar";
import "./StudentView.css";
import { createStudent } from "../../services/Firebase";
import { useStudent } from "../../context/student";
import Button from "../../components/Button";
import { useNavigate } from "react-router";
import { useAuth } from "../../context";

function StudentView() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [classSelection, setClassSelection] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoginSelected, setIsLoginSelected] = React.useState(true);

  const {allClasses} = useTeacher();
  const {showSnackbar} = useSnackbar();

  const {currentStudentNumber, setCurrentStudentNumber, isAdmitted} = useStudent();
  const navigate = useNavigate();
  const { createUser, user } = useAuth()



  const handleSignUp = useCallback(
    async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      if(!username || !classSelection || !email || !password){
        showSnackbar("Please input all correct data", "error");
        return;
      }
      try {
        setIsLoading(true);
        await createUser(email, password, username);
        await createStudent(username, classSelection);
        setCurrentStudentNumber(username);
        navigate("/student/submission");
      } catch (error: unknown) {
        showSnackbar((error as Error).message, "error");
      }finally{
        setIsLoading(false);
      }
    }
    , [username, classSelection, email, password, showSnackbar, createUser, setCurrentStudentNumber, navigate]);


  const handleLogin = useCallback(
    async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      if(!username || !classSelection){
        showSnackbar("Please input your student number and select your class", "error");
        return;
      }
      try {
        setIsLoading(true);
        await createStudent(username, classSelection);
        setCurrentStudentNumber(username);
        navigate("/student/submission");
      } catch (error: unknown) {
        showSnackbar((error as Error).message, "error");
      }finally{
        setIsLoading(false);
      }
    },
    [username, classSelection, showSnackbar, setCurrentStudentNumber, navigate],
  );

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return isLoginSelected ? handleLogin(event) : handleSignUp(event);
  }, [isLoginSelected, handleLogin, handleSignUp]);

  const submitButtonTitle = useMemo(() => {
    return isLoginSelected ? "Login" : "Sign Up";
  }, [isLoginSelected]);



  const options = useMemo(() => { 
    return allClasses.map((className) => {
      return { name: className, value: className };
    });
  }
  , [allClasses]);

  useEffect(() => {
    if(!user){
      return;
    }
    if(isAdmitted){
      navigate("/student/submission");
    }
  }, [isAdmitted, navigate, user])

  if(currentStudentNumber){
    return <div className="flex flex-col items-center w-full justify-center h-screen">
            <ScreenHero
        icon={faCheck}
        title="Waiting Confirmation"
        description="Please wait for your teacher to accept you into the class"
      />
    </div>
  }

  return (
    <div className="flex flex-col items-center w-full justify-center h-screen">
      <ScreenHero
        icon={faFileContract}
        title="Hello Student"
        description="Please input your student number and select your class to submit your tests and view your results. Be aware that your teacher has to accept your login so input your correct data."
      />
      <form onSubmit={handleSubmit} className=" items-center flex flex-col">
        <div className="flex flex-col items-center gap-2 text-lg">
        {!isLoginSelected && <input
            type="text"
            placeholder="Student Number"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="border-1 border-gray-200 hover:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
          />}
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
        <SelectSearch selection={classSelection} handleSelection={setClassSelection} options={options} placeholder="Select your Class"></SelectSearch>
      </div>
      <label
        rel="stylesheet"
        onClick={() => setIsLoginSelected(!isLoginSelected)}
        onMouseOver={(e) => (e.currentTarget.style.cursor = "pointer")}
        className="text-blue-500 underline line-height-1 mt-2"
      >
        {isLoginSelected ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
      </label>
      <div className="mt-2">
        <Button title={submitButtonTitle} loading={isLoading} onClick={() => {}} type={"submit"}/>
      </div>
      </form>

    </div>
  );
}

export default StudentView;
