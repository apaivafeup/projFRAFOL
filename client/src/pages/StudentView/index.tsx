import { useAuth } from "@context/auth";
import { useStudent } from "@context/student";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import StudentView from "./StudentView.index";

function Student() {
  const [isLoginSelected, setIsLoginSelected] = React.useState(true);

  const { isAdmitted } = useStudent();
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentIsWaitingForAdmission = useMemo(() => {
    return !!user?.displayName && !isAdmitted;
  }, [isAdmitted, user?.displayName]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (isAdmitted) {
      navigate("/student/submission");
    }
  }, [isAdmitted, navigate, user]);
  return (
    <StudentView
      isLoginSelected={isLoginSelected}
      setIsLoginSelected={setIsLoginSelected}
      studentIsWaitingForAdmission={studentIsWaitingForAdmission}
    />
  );
}

export default Student;
