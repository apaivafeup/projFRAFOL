import ProjectPicker from "../ProjectPicker";
import ProjectSubmissions from "./ProjectSubmissions";

function ManageStudentsView() {
  return (
    <div className="flex flex-col p-1">
      <ProjectPicker />
      <div className="mt-2 pb-4">
        <ProjectSubmissions />
      </div>
    </div>
  );
}

export default ManageStudentsView;
