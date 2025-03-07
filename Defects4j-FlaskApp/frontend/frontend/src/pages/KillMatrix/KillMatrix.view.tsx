import Button from "@components/Button";
import { Project } from "@context/currentProject";
import { faTable, faCross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HelpModalView from "./HelpModal/HelpModal.view";

interface KillMatrixViewProps {
  killMatrixIsNotGenerated: boolean;
  currentProject: Project | null;
  isGeneratingKillMatrix: boolean;
  handleGenerateKillMatrix: () => void;
  openHelp: boolean;
  setOpenHelp: (value: boolean) => void;
}

function KillMatrixView({
  killMatrixIsNotGenerated,
  currentProject,
  isGeneratingKillMatrix,
  handleGenerateKillMatrix,
  openHelp,
  setOpenHelp,
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
    <div className="flex flex-col p-12 items-center w-full justify-center h-screen">
      <div className="grid grid-cols-1 gap-2 p-4 w-full">
        <div className="absolute top-4 right-4">
          <Button title="?" onClick={() => setOpenHelp(true)}>
        </Button>
        </div>
        <div className="flex flex-col items-center w-full justify-center">
        <div className="flex flex-row w-full justify-center text-gray-500 items-center  gap-1">
          <FontAwesomeIcon icon={faCross} className="text-blue-500" />
          <div>= Mutant Killed</div>
        </div>
        <div className="flex flex-row w-full justify-center text-gray-500 items-center  gap-1">
         <div className="w-4 h-4 bg-red-300">
         </div>
         = Test Failed
        </div>
        </div>
        <div className="overflow-auto flex w-full flex-col rounded-md">

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
                    <td className={`${killedMutants.includes("error") ? 'bg-red-300' : ''} flex flex-col border  px-2 py-2`}>
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
                        ) :
                        (
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
        <div className="w-full flex items-center justify-center">
        <Button
          title="Generate Kill Matrix Again"
          onClick={handleGenerateKillMatrix}
          loading={isGeneratingKillMatrix}
        />
        </div>
      <HelpModalView open={openHelp} setOpen={setOpenHelp} />
      </div>
    </div>
  );
}

export default KillMatrixView;
