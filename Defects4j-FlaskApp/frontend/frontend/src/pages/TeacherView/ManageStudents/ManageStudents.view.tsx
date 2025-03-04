import ProjectSubmissionsView from "./ProjectSubmissions/ProjectSubmissions.view";
import ProjectPicker from "../ProjectPicker";

function ManageStudents() {
  return (
    <div className="flex flex-col p-1">
      <ProjectPicker />
      <div className="mt-2 pb-4">
        <ProjectSubmissionsView />
      </div>
    </div>
  );
}

export default ManageStudents;
