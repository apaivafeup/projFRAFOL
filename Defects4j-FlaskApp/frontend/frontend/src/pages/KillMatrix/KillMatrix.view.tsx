import Button from "@components/Button";
import { Project } from "@context/currentProject";
import { faTable, faCross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface KillMatrixViewProps {
  killMatrixIsNotGenerated: boolean;
  currentProject: Project | null;
  isGeneratingKillMatrix: boolean;
  handleGenerateKillMatrix: () => void;
}

function KillMatrixView({
  killMatrixIsNotGenerated,
  currentProject,
  isGeneratingKillMatrix,
  handleGenerateKillMatrix,
}: KillMatrixViewProps) {
  if (killMatrixIsNotGenerated) {
    return (
      <div className="flex flex-col items-center w-full justify-center h-screen">
        <FontAwesomeIcon icon={faTable} size="6x" className="text-blue-500" />
        <h1 className="text-3xl font-semibold">Kill Matrix</h1>
        <p className="text-gray-500">
          The kill matrix contains information about the mutants which have been
          killed by the developed student tests
        </p>
        <p className="text-gray-500">
          This can be calculated by running each test against the entire
          mutants, therefore, generating this matrix may take a while
        </p>
        <Button
          title="Generate Kill Matrix"
          onClick={handleGenerateKillMatrix}
          loading={isGeneratingKillMatrix}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen p-4 w-full gap-1 items-center">
      <div className="flex flex-row text-gray-500 items-center  gap-1">
        <FontAwesomeIcon icon={faCross} className="text-blue-500" />
        <div>= Mutant Killed</div>
      </div>
      <div className="overflow-auto max-w-screen md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl rounded-md">
        <table className="border-collapse rounded-xl">
          <thead>
            <tr>
              <th className="border px-4 py-2 min-w-48">
                Test Name / Mutant Id
              </th>
              {currentProject?.killMatrixHeaders?.map((header, index) => (
                <th key={index} className="border px-2 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentProject?.killMatrix ?? {}).map(
              ([testMethod, killedMutants], index) => (
                <tr className="" key={index}>
                  <td className="flex flex-col border  px-2 py-2">
                    {testMethod}
                  </td>
                  {currentProject?.killMatrixHeaders?.map((header, index) => (
                    <td key={index} className="border">
                      {killedMutants.includes(header) ? (
                        <div className="flex flex-col items-center self-stretch">
                          <FontAwesomeIcon
                            icon={faCross}
                            className="text-blue-500"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <Button
        title="Generate Kill Matrix Again"
        onClick={handleGenerateKillMatrix}
        loading={isGeneratingKillMatrix}
      />
    </div>
  );
}

export default KillMatrixView;
