import ListView from "../../../../../components/List/List.view";
import { ListItem } from "../../../../../components/ListItem/ListItem.view";

interface PendingStudentsViewProps {
    pendingStudents: ListItem[];
}
function PendingStudentsView( {pendingStudents}: PendingStudentsViewProps) {
  return (
    <div className="flex flex-col gap-1">
    <label className="text-xl font-semibold" htmlFor="">
        Pending Students:
      </label>
    <ListView items={pendingStudents} />
  </div>
  )
}

export default PendingStudentsView