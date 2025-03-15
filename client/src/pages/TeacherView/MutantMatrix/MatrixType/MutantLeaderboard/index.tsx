import { useTeacher } from "@context/teacher";
import MutantLeaderboardView from "./MutantLeaderboard.view";

function MutantLeaderboard() {
  const { currentProjectSubmissions } = useTeacher();

  return (
    <MutantLeaderboardView
      currentProjectSubmissions={currentProjectSubmissions}
    />
  );
}

export default MutantLeaderboard;
