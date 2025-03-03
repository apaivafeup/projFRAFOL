import { useCurrentProject } from "../../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross } from "@fortawesome/free-solid-svg-icons";
import { CodeEditor } from "../../../components/CodeEditor";
import Button from "../../../components/Button";

function SubmissionView() {
  const { currentProject } = useCurrentProject();
  return (
    <div className="grid grid-cols-2 p-12 h-screen max-h-screen w-full justify-center">
      <div className="flex flex-col items-start gap-2">
        <h4>Submission Data</h4>
        <div>
          <label>Student ID:</label>
        </div>
        <div>
          <label>Killed Mutants:</label>
          {currentProject && currentProject?.killedMutants?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Mutant ID</th>
                </tr>
              </thead>
              <tbody>
                {currentProject?.killedMutants.map((mutant, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="flex flex-row gap-1">
                          <FontAwesomeIcon icon={faCross}></FontAwesomeIcon>{" "}
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
        <Button title="Submit Project" onClick={() => {}}></Button>
      </div>
      <div>
        <CodeEditor code="coco"></CodeEditor>
      </div>
    </div>
  );
}

export default SubmissionView;
