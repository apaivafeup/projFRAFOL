import Button from "@components/Button";
import SelectProjectDropdown from "./components/SelectProjectDropdown";
import { ChangeEvent } from "react";
import { ButtonLoader } from "@components/ButtonLoader";

interface WelcomeViewProps {
  importProjects: string[];
  openProjects: string[];
  avaliableVersions: string[];
  selectedImportProject: string;
  selectedVersion: string;
  selectedOpenProject: string;
  selectedMutationTool: string;
  importProjectLoading: boolean;
  openProjectLoading: boolean;
  handleNewImportProject: (project: ChangeEvent<HTMLSelectElement>) => void;
  handleNewImportProjectVersion: (
    version: ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleImportProject: () => void;
  handleNewOpenProject: (project: ChangeEvent<HTMLSelectElement>) => void;
  handleNewMutationTool: (tool: ChangeEvent<HTMLSelectElement>) => void;
  handleOpenProject: () => void;
  mutationToolsValues: string[];
}

function WelcomeView({
  importProjects,
  openProjects,
  avaliableVersions,
  selectedImportProject,
  selectedVersion,
  selectedOpenProject,
  selectedMutationTool,
  importProjectLoading,
  openProjectLoading,
  handleNewImportProject,
  handleNewImportProjectVersion,
  handleImportProject,
  handleNewOpenProject,
  handleNewMutationTool,
  handleOpenProject,
  mutationToolsValues,
}: WelcomeViewProps) {
  return (
    <div className="flex flex-col flex-1 h-screen gap- 2 items-center pt-24">
      <div className="p-4 flex flex-col gap-2 w-full items-center justify-center border-gray-200">
        <ButtonLoader
          width={140}
          height={140}
          color={"oklch(0.623 0.214 259.815)"}
        />
        <div className="text-4xl font-semibold text-black text-center">
          Welcome to <b className="font-semibold text-blue-500">FRAFOL</b>
        </div>
      </div>
      <div className="p-4 mt-2 border-gray-200 shadow-xl border-1 items-center justify-center rounded-xl">
        <div className="text-xl font-semibold text-black">
          Import Project to Test:
        </div>
        <div className="flex flex-row gap-2">
          <SelectProjectDropdown
            label="Project"
            values={importProjects}
            width={170}
            onChange={handleNewImportProject}
            value={selectedImportProject}
          />
          <SelectProjectDropdown
            label="Version"
            values={avaliableVersions}
            width={50}
            onChange={handleNewImportProjectVersion}
            value={selectedVersion}
          />
        </div>
        <div className="mt-2">
          <Button
            title="Import"
            onClick={handleImportProject}
            disabled={openProjectLoading}
            loading={importProjectLoading}
          />
        </div>
        <div className="text-xl font-semibold text-black mt-4">
          Open Project:
        </div>
        <div className="flex flex-row gap-2">
          <SelectProjectDropdown
            label="Project"
            values={openProjects}
            width={170}
            onChange={handleNewOpenProject}
            value={selectedOpenProject}
          />
          <SelectProjectDropdown
            label="Mutation Tool"
            values={mutationToolsValues}
            onChange={handleNewMutationTool}
            value={selectedMutationTool.toUpperCase()}
          />
        </div>
        <div className="mt-2">
          <Button
            title="Open"
            onClick={handleOpenProject}
            disabled={importProjectLoading}
            loading={openProjectLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeView;
