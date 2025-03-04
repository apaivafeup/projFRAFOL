import React, {useEffect } from "react";
import ScreenHero from "../../components/ScreenHero/ScreenHero.view";
import { faCheck, faFileContract } from "@fortawesome/free-solid-svg-icons";

//import 'react-select-search/style.css'
import "./SelectSearchLight.css";

import { useStudent } from "../../context/student";
import { useNavigate } from "react-router";
import { useAuth } from "../../context";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function StudentView() {
  const [isLoginSelected, setIsLoginSelected] = React.useState(true);



  const {  isAdmitted } =
    useStudent();
  const navigate = useNavigate();
  const { user} = useAuth();

 

  useEffect(() => {
    if (!user) {
      return;
    }

    if (isAdmitted) {
      navigate("/student/submission");
    }
  }, [isAdmitted, navigate, user]);

  if (user?.displayName && !isAdmitted) {
    return (
      <div className="flex flex-col items-center w-full justify-center h-screen">
        <ScreenHero
          icon={faCheck}
          title="Waiting Confirmation"
          description="Please wait for your teacher to accept you into the class"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full justify-center h-screen">
      <ScreenHero
        icon={faFileContract}
        title="Hello Student"
        description="Please input your student number and select your class to submit your tests and view your results. Be aware that your teacher has to accept your login so input your correct data."
      />
      {isLoginSelected ? (
        <LoginForm setIsLoginSelected={setIsLoginSelected} />
      ) : (
        <SignupForm setIsLoginSelected={setIsLoginSelected} />
      )}
    </div>
  );
}

export default StudentView;
