import { useAuth, useCurrentProject } from "../../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross } from "@fortawesome/free-solid-svg-icons";
import { CodeEditor } from "../../../components/CodeEditor";
import Button from "../../../components/Button";
import CurrentProjectHeader from "../../../components/CurrentProjectHeader";
import { useCallback, useState } from "react";
import { addSubmission } from "../../../services/Firebase";
import { useStudent } from "../../../context/student";
import { useSnackbar } from "../../../context/snackbar";
import { useNavigate } from "react-router";

function SubmissionView() {
  const { currentProject, studentCode } = useCurrentProject();
  const { currentClassName } = useStudent();
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
    <div className="grid grid-cols-2 p-12 h-screen max-h-screen w-full justify-center">
      <div className="flex flex-col items-start gap-2">
        <h4>
          Hello, <b className="text-blue-500">{user?.displayName}</b>
        </h4>
        <div>
          <label className="font-semibold">Student ID:</label>
          <div className="mb-2">{user?.displayName}</div>
          <label className="font-semibold">Email:</label>
          <div className="mb-2">{user?.email}</div>
          <label className="font-semibold">Class:</label>
          <div className="mb-2">{user?.photoURL}</div>
          <Button title="Logout" onClick={handleLogout}></Button>
        </div>
        <div>
          <div className="mt-2 pt-2 mb-4 border-t-1 border-t-gray-200">
            <CurrentProjectHeader />
          </div>
          <label className="font-semibold">Killed Mutants:</label>
          {currentProject && currentProject?.killedMutants?.length > 0 ? (
            <table className="max-h-96 overflow-scroll">
              <tbody>
                {currentProject?.killedMutants.map((mutant, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="flex flex-row gap-1 items-center">
                          <FontAwesomeIcon
                            className="text-blue-500"
                            icon={faCross}
                          ></FontAwesomeIcon>{" "}
                          {mutant}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>No Killed Mutants yet</div>
          )}
        </div>
        <Button title="Submit Project" onClick={handleSubmit}></Button>
      </div>
      <div>
        <CodeEditor code={studentCode}></CodeEditor>
      </div>
    </div>
  );
}

export default SubmissionView;
