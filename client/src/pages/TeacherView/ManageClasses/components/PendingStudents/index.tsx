import { useCallback, useEffect, useState } from "react";
import { useTeacher } from "@context/teacher";
import { useSnackbar } from "@context/snackbar";
import {
  admitStudent,
  deleteStudentAdmission as deleteStudent,
} from "@services/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import PendingStudentsView from "./PendingStudents.view";

function PendingStudents() {
  const { currentClassAdmissions, currentClassName, getCurrentClassStudents } =
    useTeacher();
  const { showSnackbar } = useSnackbar();
  const [optimisticAdmissions, setOptimisticAdmissions] = useState<string[]>(
    currentClassAdmissions,
  );

  const deleteStudentAdmission = useCallback(
    async (student: string) => {
      setOptimisticAdmissions((prev) => prev.filter((s) => s !== student));

      try {
        await deleteStudent(student, currentClassName);
        getCurrentClassStudents();
        showSnackbar("Student admission removed successfully", "success");
      } catch (e) {
        console.error("Error removing student admission", e);
        showSnackbar("Error removing student admission", "error");

        setOptimisticAdmissions(currentClassAdmissions);
      }
    },
    [
      currentClassAdmissions,
      currentClassName,
      getCurrentClassStudents,
      showSnackbar,
    ],
  );

  const acceptStudentAdmission = useCallback(
    async (student: string) => {
      setOptimisticAdmissions((prev) => prev.filter((s) => s !== student));

      try {
        await admitStudent(student, currentClassName);
        await deleteStudent(student, currentClassName);
        getCurrentClassStudents();
        showSnackbar("Student admitted successfully", "success");
      } catch (e) {
        console.error("Error admitting student", e);
        showSnackbar("Error admitting student", "error");

        setOptimisticAdmissions(currentClassAdmissions);
      }
    },
    [
      currentClassAdmissions,
      currentClassName,
      getCurrentClassStudents,
      showSnackbar,
    ],
  );

  const pendingStudents = optimisticAdmissions.map((student) => {
    return {
      title: student,
      onSuccess: acceptStudentAdmission,
      onDecline: deleteStudentAdmission,
      logo: <FontAwesomeIcon icon={faUser} width={24} height={24} />,
    };
  });

  useEffect(() => {
    setOptimisticAdmissions(currentClassAdmissions);
  }, [currentClassAdmissions]);

  return <PendingStudentsView pendingStudents={pendingStudents} />;
}

export default PendingStudents;
