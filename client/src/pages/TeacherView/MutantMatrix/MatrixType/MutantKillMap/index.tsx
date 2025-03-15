import { useTeacher } from "@context/teacher";
import MutantKillMapView from "./MutantKillMap.view";

function MutantKillMap() {
  const { currentProjectSubmissions } = useTeacher();

  const tableHeaders = currentProjectSubmissions
    ?.map((submission) => submission.killedMutants)
    .flat();
  const uniqueHeaders = [...new Set(tableHeaders)];

  return (
    <MutantKillMapView
      currentProjectSubmissions={currentProjectSubmissions}
      mutantIds={uniqueHeaders}
    />
  );
}

export default MutantKillMap;
