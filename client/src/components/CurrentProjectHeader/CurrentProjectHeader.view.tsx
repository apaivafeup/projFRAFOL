import { Project } from "@context/currentProject";

interface CurrentProjectHeaderViewProps {
  currentProject: Project | null;
}
function CurrentProjectHeaderView({
  currentProject,
}: CurrentProjectHeaderViewProps) {
  return (
    <div className="flex flex-row gap-4 text-black">
      <label className="text-xl font-semibold" htmlFor="">
        Working Project: {currentProject?.name}
      </label>
      <label className="text-xl font-semibold" htmlFor="">
        Mutation Tool: {currentProject?.mutationTool}
      </label>
    </div>
  );
}

export default CurrentProjectHeaderView;
