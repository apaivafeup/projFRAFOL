import SelectSearch from "@components/SelectSearch";

interface ProjectPickerViewProps {
  projects: { name: string; value: string }[];
  currentProject: string | null;
  setCurrentProject: (project: string) => void;
}

function ProjectPickerView({
  projects,
  currentProject,
  setCurrentProject,
}: ProjectPickerViewProps) {
  return (
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
  );
}

export default ProjectPickerView;
