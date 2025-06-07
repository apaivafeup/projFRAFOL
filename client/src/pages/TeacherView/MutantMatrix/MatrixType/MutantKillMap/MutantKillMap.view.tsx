import { faCross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StudentSubmission } from "@services/Firebase";

interface MutantKillMapViewProps {
  currentProjectSubmissions?: StudentSubmission[] | null;
  mutantIds?: string[];
}

function MutantKillMapView({
  currentProjectSubmissions,
  mutantIds,
}: MutantKillMapViewProps) {
  return (
    <div className="flex flex-col w-full h-full gap-2 items-center justify-center">
      <div className="flex flex-row text-gray-500 items-center  gap-1">
        <FontAwesomeIcon icon={faCross} className="text-blue-500" />
        <div>= Mutant Killed</div>
      </div>
      <div className="overflow-auto flex w-full flex-col rounded-md">
        <table className="border-collapse rounded-xl">
          <thead>
            <tr>
              <th className="border px-4 py-2 min-w-48">
                Test Name / Mutant Id
              </th>
              {mutantIds?.map((header, index) => (
                <th key={index} className="border px-2 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentProjectSubmissions?.map((submission, index) => (
              <tr className="" key={index}>
                <td className="flex flex-col border  px-2 py-2">
                  {submission.studentNumber}
                </td>
                {mutantIds?.map((header, index) => (
                  <td key={index} className="border">
                    {typeof submission.killedMutants === "object" &&
                    submission?.killedMutants?.includes(header) ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MutantKillMapView;
