import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross } from "@fortawesome/free-solid-svg-icons";
import { CodeEditor } from "../../../components/CodeEditor";
import Button from "../../../components/Button";
import CurrentProjectHeader from "../../../components/CurrentProjectHeader";
import { Project } from "@context/currentProject";
import { User } from "firebase/auth";

interface SubmissionViewProps {
  studentCode: string;
  currentProject: Project | null;
  user: User | null;
  handleLogout: () => void;
  handleSubmit: () => void;
  submitLoading: boolean;
}

function SubmissionView({
  studentCode,
  currentProject,
  user,
  handleLogout,
  handleSubmit,
  submitLoading,
}: SubmissionViewProps) {
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
        <Button
          title="Submit Project"
          onClick={handleSubmit}
          loading={submitLoading}
        />
      </div>
      <div>
        <CodeEditor code={studentCode}></CodeEditor>
      </div>
    </div>
  );
}

export default SubmissionView;
