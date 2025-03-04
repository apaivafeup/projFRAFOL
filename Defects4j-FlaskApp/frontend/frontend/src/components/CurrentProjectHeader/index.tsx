import { useCurrentProject } from '../../context';

function CurrentProjectHeader() {
    const { currentProject } = useCurrentProject();
  return (
    <div className="flex flex-row gap-4 text-black">
    <label className="text-xl font-semibold" htmlFor="">
      Working Project: {currentProject?.name}
    </label>
    <label className="text-xl font-semibold" htmlFor="">
      Mutation Tool: {currentProject?.mutationTool}
    </label>
  </div>
  )
}

export default CurrentProjectHeader