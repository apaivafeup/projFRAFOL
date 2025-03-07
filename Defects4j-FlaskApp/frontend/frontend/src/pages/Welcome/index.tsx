import { useCurrentProject } from "@context/currentProject";
import { Defects4GuiApiService } from "@services/Defects4GuiApi";
import { ProjectType, MutationTools } from "@utils/index";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import WelcomeView from "./Welcome.view";

function Welcome() {
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

  const { openProject, setIsCurrentProjectFirstMutationComplete } =
    useCurrentProject();
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

  const mutationToolsValues = useMemo(() => {
    return Object.values(MutationTools).map((tool) => {
      if(selectedOpenProject === ProjectType.COMPRESS_44) {
        return tool === MutationTools.MAJOR ? undefined : tool.toUpperCase()
      } 
      return tool.toUpperCase()
    }
    ).filter((tool) => tool !== undefined);
  }, [selectedOpenProject]);


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
      console.log(e.target.value);
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
    <WelcomeView
      importProjects={importProjects}
      openProjects={openProjects}
      avaliableVersions={avaliableVersions}
      selectedImportProject={selectedImportProject}
      selectedVersion={selectedVersion}
      selectedOpenProject={selectedOpenProject}
      selectedMutationTool={selectedMutationTool}
      importProjectLoading={importProjectLoading}
      openProjectLoading={openProjectLoading}
      handleNewImportProject={handleNewImportProject}
      handleNewImportProjectVersion={handleNewImportProjectVersion}
      handleImportProject={handleImportProject}
      handleNewOpenProject={handleNewOpenProject}
      handleNewMutationTool={handleNewMutationTool}
      handleOpenProject={handleOpenProject}
      mutationToolsValues={mutationToolsValues}
    />
  );
}

export default Welcome;
