import { useCallback, useEffect, useRef, useState } from "react";
import { Defects4GuiApiService } from "../../services/Defects4GuiApi";
import { MutationTools, ProjectType } from "../../utils";
import { useCurrentProject } from "../../context";
import { useNavigate } from "react-router";
import { ButtonLoader } from "../../components/ButtonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { Circles } from "react-loader-spinner";

function WelcomeView() {
  const [importProjects, setImportProjects] = useState<string[]>([]);
  const [selectedImportProject, setSelectedImportProject] =
    useState<ProjectType>(ProjectType.CLI);
  const [importProjectLoading, setImportProjectLoading] =
    useState<boolean>(false);

  const [openProjects, setOpenProjects] = useState<string[]>([]);
  const [selectedOpenProject, setSelectedOpenProject] = useState<ProjectType>(
    ProjectType.CLI,
  );
  const [openProjectLoading, setOpenProjectLoading] = useState<boolean>(false);

  const [avaliableVersions, setAvaliableVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  const [selectedMutationTool, setSelectedMutationTool] =
    useState<MutationTools>(MutationTools.MAJOR);

  const apiService = useRef(new Defects4GuiApiService()).current;

  const {
    openProject,
    setStudentCode,
    setIsCurrentProjectFirstMutationComplete,
  } = useCurrentProject();
  const navigate = useNavigate();

  const getAvaliableVersionForSelectedProject = useCallback(
    async (project: string) => {
      const { versions } = await apiService.getAvaliableVersions(
        project as ProjectType,
      );
      setAvaliableVersions(versions);
      setSelectedVersion(versions[0]);
    },
    [apiService],
  );

  const handleNewImportProject = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const project = e.target.value as ProjectType;
      setSelectedImportProject(project);
    },
    [],
  );

  const handleNewImportProjectVersion = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const version = e.target.value;
      setSelectedVersion(version);
    },
    [],
  );

  const handleNewOpenProject = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const project = e.target.value as ProjectType;
      setSelectedOpenProject(project);
    },
    [],
  );

  const handleNewMutationTool = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const mutationTool = e.target.value.toLowerCase() as MutationTools;
      setSelectedMutationTool(mutationTool);
    },
    [],
  );

  const handleImportProject = useCallback(async () => {
    setImportProjectLoading(true);
    try {
      const { projects_to_open } = await apiService.importProject(
        selectedImportProject,
        selectedVersion,
      );
      setOpenProjects(projects_to_open);
    } catch (error) {
      console.error("Error importing project:", error);
    } finally {
      setImportProjectLoading(false);
    }
  }, [apiService, selectedImportProject, selectedVersion]);

  const handleOpenProject = useCallback(async () => {
    setOpenProjectLoading(true);
    try {
      const newProject = await apiService.openProject(
        selectedOpenProject,
        selectedMutationTool,
      );
      setIsCurrentProjectFirstMutationComplete(false);
      openProject(newProject);
      navigate("/analyzer");
    } catch (error) {
      console.error("Error opening project:", error);
    } finally {
      setOpenProjectLoading(false);
    }
  }, [
    apiService,
    selectedOpenProject,
    selectedMutationTool,
    setIsCurrentProjectFirstMutationComplete,
    openProject,
    navigate,
  ]);

  useEffect(() => {
    async function fetchProjects() {
      const projects = await apiService.getAvaliableProjects();
      setImportProjects(projects.projects_to_import);
      setOpenProjects(projects.projects_to_open);
    }
    fetchProjects();
  }, [apiService]);

  useEffect(() => {
    getAvaliableVersionForSelectedProject(selectedImportProject);
  }, [getAvaliableVersionForSelectedProject, selectedImportProject]);

  useEffect(() => {
    if (openProjects.length > 0) {
      setSelectedOpenProject(openProjects[0] as ProjectType);
    }
  }, [openProjects]);

  return (
    <div className="flex flex-col flex-1 h-screen gap- 2 items-center pt-24">
      <div className="p-4 flex flex-col gap-2 w-full items-center justify-center border-gray-200">
        <Circles
          height="140"
          width="140"
          color="oklch(0.623 0.214 259.815)"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass="items-center text-center justify-center"
          visible={true}
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
          <div className="mt-2 flex flex-col">
            <label className="text-black">Project</label>
            <select
              name="select_project"
              className="min-w-[170px]  border-1 border-gray-200 bg-white mt-2 text-black"
              id="select_menu_one"
              value={selectedImportProject}
              onChange={handleNewImportProject}
            >
              {importProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-black">Version</label>
            <select
              name="select_version"
              className="w-[50px] border-1 border-gray-200 bg-white mt-2 text-black"
              id="select_version"
              value={selectedVersion}
              onChange={handleNewImportProjectVersion}
            >
              {avaliableVersions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleImportProject}
          className="mt-2 w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          disabled={openProjectLoading}
        >
          {importProjectLoading ? <ButtonLoader /> : "Import"}
        </button>

        <div className="text-xl font-semibold text-black mt-4">
          Open Project:
        </div>
        <div className="flex flex-row gap-2">
          <div className="mt-2 flex flex-col">
            <label className="text-black">Project</label>
            <select
              name="select_project"
              className="min-w-[170px] border-1 border-gray-200 bg-white mt-2 text-black"
              id="select_menu_one"
              value={selectedOpenProject}
              onChange={handleNewOpenProject}
            >
              {openProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex flex-col">
            <label className="text-black">Mutation Tool</label>
            <select
              name="select_project"
              className="border-1 border-gray-200 bg-white mt-2 text-black"
              id="select_menu_one"
              value={selectedMutationTool}
              onChange={handleNewMutationTool}
            >
              {Object.values(MutationTools).map((mutationTool) => (
                <option key={mutationTool} value={mutationTool}>
                  {mutationTool.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          disabled={importProjectLoading}
          onClick={handleOpenProject}
          className="mt-2 w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {openProjectLoading ? <ButtonLoader /> : "Open"}
        </button>
      </div>
    </div>
  );
}

export default WelcomeView;
