import { useMemo } from "react";
import ProjectPickerView from "./ProjectPicker.view";
import { useTeacher } from "@context/teacher";

function ProjectPicker() {
  const { currentClassProjects, currentProject, setCurrentProject } =
    useTeacher();

  const projects = useMemo(() => {
    if (!currentClassProjects) return [];
    return currentClassProjects.map((project) => {
      return { name: project, value: project };
    });
  }, [currentClassProjects]);

  return (
    <ProjectPickerView
      projects={projects}
      currentProject={currentProject}
      setCurrentProject={setCurrentProject}
    />
  );
}

export default ProjectPicker;
