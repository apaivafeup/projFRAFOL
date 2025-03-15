import { faCross } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StudentSubmission } from "@services/Firebase";

interface MutantLeaderboardViewProps {
  currentProjectSubmissions?: StudentSubmission[] | null;
}

function MutantLeaderboardView({
  currentProjectSubmissions,
}: MutantLeaderboardViewProps) {
  return (
    <>
      <div className="overflow-auto max-w-screen md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl rounded-md">
        <table className="border-collapse rounded-xl">
          <thead>
            <tr>
              <th className="border px-4 py-2 min-w-48">
                Student Number / Total Mutants Killed
              </th>

              <th className="border px-2 py-2 gap-1">
                <FontAwesomeIcon
                  icon={faCross}
                  className="text-blue-500 mr-2"
                />
                Mutants Killed
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProjectSubmissions?.map((submission, index) => (
              <tr key={index}>
                <td className="border px-2 py-2">{submission.studentNumber}</td>
                <td className="border px-2 py-2">
                  {submission?.killedMutants?.length || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MutantLeaderboardView;
