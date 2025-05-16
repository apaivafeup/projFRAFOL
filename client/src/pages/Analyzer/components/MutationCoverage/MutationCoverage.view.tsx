import { CoverageCard } from "@components/CoverageCard";
import CodeMirror from "@uiw/react-codemirror";
import CurrentProjectHeader from "@components/CurrentProjectHeader";
import { abyss } from "@uiw/codemirror-themes-all";
import { basicSetup } from "codemirror";
import { Project } from "@context/currentProject";
import Button from "@components/Button";

interface MutationCoverageViewProps {
  compilationMessage: string;
  isCompiling: boolean;
  isMutating: boolean;
  isMutateButtonDisabled: boolean;
  isUpdatingCoverage: boolean;
  currentProject: Project | null;
  handleMutate: () => void;
  handleCompile: () => void;
  handleCoverage: () => void;
}

function MutationCoverageView({
  compilationMessage,
  isCompiling,
  isMutating,
  isMutateButtonDisabled,
  isUpdatingCoverage,
  currentProject,
  handleMutate,
  handleCompile,
  handleCoverage,
}: MutationCoverageViewProps) {
  return (
    <>
      <CurrentProjectHeader />
      <div className=" grid md:grid-cols-3 gap-4 mt-4">
        <CoverageCard
          title="Code Coverage"
          coverage={Number(currentProject?.metricData[4])}
          ratio={`${currentProject?.metricData[1]}/${currentProject?.metricData[0]}`}
        />
        <CoverageCard
          title="Condition Coverage"
          coverage={Number(currentProject?.metricData[5])}
          ratio={`${currentProject?.metricData[3]}/${currentProject?.metricData[2]}`}
        />

        <CoverageCard
          title="Mutation"
          coverage={Number(currentProject?.mutationSummaryData[3])}
          ratio={`${currentProject?.mutationSummaryData[1]}/${currentProject?.mutationSummaryData[0]} \n Live: ${currentProject?.mutationSummaryData[2]}`}
        />
      </div>
      <div className="mt-4 gap-2 flex flex-col">
        <div className="flex flex-row gap-2">
          <Button
            title="Mutate"
            onClick={handleMutate}
            loading={isMutating}
            disabled={isMutateButtonDisabled}
            isDisabled={isMutateButtonDisabled}
          />
          <Button
            title="Compile"
            onClick={handleCompile}
            loading={isCompiling}
          />
          <Button
            title="Update Coverage"
            onClick={handleCoverage}
            loading={isUpdatingCoverage}
          />
        </div>
        {compilationMessage && (
          <div className="max-h-[400px] overflow-scroll">
            <CodeMirror
              value={compilationMessage}
              height="120"
              maxHeight="400"
              extensions={[abyss, basicSetup]}
              basicSetup={{ lineNumbers: true }}
              editable={false}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default MutationCoverageView;
