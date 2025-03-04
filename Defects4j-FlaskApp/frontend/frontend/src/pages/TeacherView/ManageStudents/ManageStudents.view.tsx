import { useMemo } from "react";

import SelectSearch from "../../../components/SelectSearch";
import { useTeacher } from "../../../context/teacher";
import ProjectSubmissionsView from "./ProjectSubmissions/ProjectSubmissions.view";
import Button from "../../../components/Button";

function ManageStudents() {
  const { currentClassProjects, currentProject, setCurrentProject, currentClassName } =
    useTeacher();

  const projects = useMemo(() => {
    if (!currentClassProjects) return [];
    return currentClassProjects.map((project) => {
      return { name: project, value: project };
    });
  }, [currentClassProjects]);
  

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2 items-center text-black">
        <label className="text-xl font-semibold" htmlFor="">
          Project:
        </label>
        <SelectSearch
          selection={currentProject || ""}
          handleSelection={setCurrentProject}
          options={projects}
          placeholder="Select Project"
        ></SelectSearch>
      </div>
      <div className="mt-2 pb-4">
        <ProjectSubmissionsView />
      </div>
    </div>
  );
}

export default ManageStudents;
