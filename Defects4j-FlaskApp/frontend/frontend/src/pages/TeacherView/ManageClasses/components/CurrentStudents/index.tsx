import { useCallback, useEffect, useState } from "react";
import { useTeacher } from "@context/teacher";
import { useSnackbar } from "@context/snackbar";
import { deleteAdmittedStudent } from "@services/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import CurrentStudentsView from "./CurrentStudents.view";

function PendingStudents() {
  const { currentClassStudents, currentClassName } = useTeacher();
  const { showSnackbar } = useSnackbar();
  const [optimisticStudents, setOptimisticStudents] =
    useState<string[]>(currentClassStudents);

  const deleteStudent = useCallback(
    async (student: string) => {
      setOptimisticStudents((prev) => prev.filter((s) => s !== student));
      try {
        await deleteAdmittedStudent(student, currentClassName);
        showSnackbar("Student removed from class successfully", "success");
      } catch {
        showSnackbar("Error removing student", "error");
        setOptimisticStudents(currentClassStudents);
      }
    },
    [currentClassName, currentClassStudents, showSnackbar],
  );

  const currentStudents = optimisticStudents.map((student) => {
    return {
      title: student,
      logo: <FontAwesomeIcon icon={faUser} width={24} height={24} />,
      onDecline: deleteStudent,
    };
  });

  useEffect(() => {
    setOptimisticStudents(currentClassStudents);
  }, [currentClassStudents]);

  return <CurrentStudentsView currentStudents={currentStudents} />;
}

export default PendingStudents;
