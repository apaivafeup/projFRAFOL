import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faCross } from "@fortawesome/free-solid-svg-icons";
import { useCurrentProject } from "../../context";
import { useCallback, useRef } from "react";
import { Defects4GuiApiService } from "../../services/Defects4GuiApi";
import { ButtonLoader } from "../../components/ButtonLoader";
import Button from "../../components/Button";

export const KillMatrix = () => {
  const {
    currentProject,
    studentCode,
    savePartialProject,
    isGeneratingKillMatrix,
    setIsGeneratingKillMatrix,
  } = useCurrentProject();
  const apiService = useRef(new Defects4GuiApiService()).current;

  const handleGenerateKillMatrix = useCallback(async () => {
    if (!currentProject || isGeneratingKillMatrix) return;
    setIsGeneratingKillMatrix(true);
    try {
      const { killMatrix, killMatrixHeaders } =
        await apiService.generateKillMatrix(
          currentProject.name,
          currentProject.mutationTool,
          studentCode,
        );
      savePartialProject({ killMatrix, killMatrixHeaders });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingKillMatrix(false);
    }
  }, [
    apiService,
    currentProject,
    isGeneratingKillMatrix,
    savePartialProject,
    setIsGeneratingKillMatrix,
    studentCode,
  ]);

  if (
    !currentProject?.killMatrix ||
    !currentProject?.killMatrixHeaders ||
    !Object.keys(currentProject.killMatrix).length
  ) {
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
          <Button title="Generate Kill Matrix" onClick={handleGenerateKillMatrix} loading={isGeneratingKillMatrix} />
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
              {currentProject.killMatrixHeaders?.map((header, index) => (
                <th key={index} className="border px-2 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentProject.killMatrix).map(
              ([testMethod, killedMutants], index) => (
                <tr className="" key={index}>
                  <td className="flex flex-col border  px-2 py-2">
                    {testMethod}
                  </td>
                  {currentProject.killMatrixHeaders?.map((header, index) => (
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
      <div>
        <button
          onClick={handleGenerateKillMatrix}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isGeneratingKillMatrix ? (
            <ButtonLoader />
          ) : (
            "Generate Kill Matrix Again"
          )}
        </button>
      </div>
    </div>
  );
};
