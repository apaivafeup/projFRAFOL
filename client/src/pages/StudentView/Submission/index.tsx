import { addSubmission } from "@services/Firebase";
import SubmissionView from "./Submission.view";
import { useAuth } from "@context/auth";
import { useCurrentProject } from "@context/currentProject";
import { useSnackbar } from "@context/snackbar";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

function Submission() {
  const { currentProject, studentCode } = useCurrentProject();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/student");
  }, [logout, navigate]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      if (
        !currentProject?.name ||
        !currentProject?.mutationTool ||
        !currentProject?.killedMutants ||
        !studentCode ||
        !user?.displayName ||
        !user?.photoURL
      ) {
        throw new Error(
          "For submission, you need to authenticated, have a selected project, killed mutants and student code",
        );
      }
      await addSubmission({
        className: user?.photoURL,
        projectName: `${currentProject?.name}_${currentProject?.mutationTool}`,
        studentNumber: user?.displayName,
        submissionDate: new Date().toISOString(),
        killedMutants: currentProject?.killedMutants || [],
        code: studentCode,
      });
      showSnackbar("Project submitted successfully", "success");
    } catch (e) {
      showSnackbar("" + e, "error");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [
    currentProject?.killedMutants,
    currentProject?.mutationTool,
    currentProject?.name,
    showSnackbar,
    studentCode,
    user?.displayName,
    user?.photoURL,
  ]);

  return (
    <SubmissionView
      handleLogout={handleLogout}
      handleSubmit={handleSubmit}
      submitLoading={isLoading}
      studentCode={studentCode}
      currentProject={currentProject}
      user={user}
    />
  );
}

export default Submission;
