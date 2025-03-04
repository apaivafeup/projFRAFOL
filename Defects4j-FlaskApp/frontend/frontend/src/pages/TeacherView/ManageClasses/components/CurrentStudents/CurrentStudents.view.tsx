import ListView from "../../../../../components/List/List.view";
import { ListItem } from "../../../../../components/ListItem/ListItem.view";

interface CurrentStudentsViewProps {
  currentStudents: ListItem[];
}
function CurrentStudentsView({ currentStudents }: CurrentStudentsViewProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xl font-semibold" htmlFor="">
        Current Students:
      </label>
      <ListView items={currentStudents} />
    </div>
  );
}

export default CurrentStudentsView;
