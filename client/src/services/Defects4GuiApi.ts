import { MutationTools, ProjectType } from "../utils";
import api from "./api";
import { Endpoints } from "./Endpoints";

interface AvaliableProjectsResponse {
  projects_to_import: string[];
  projects_to_open: string[];
}

interface ImportProjectResponse {
  projects_to_open: string[];
}

interface OpenProjectResponse {
  project: ProjectType;
  tool: MutationTools;
  table_header: string[];
  sheet_data: [][];
  metric_data: string[];
  summary_data: string[] | number[];
  test_class: string;
  dev_suite: string;
  coverage_data: Record<string, Array<number>>;
}

export class Defects4GuiApiService {
  public constructor() {}

  async getAvaliableProjects() {
    const response = await api.get<AvaliableProjectsResponse>(
      Endpoints.GET_AVALIABLE_PROJECTS,
    );

    return response.data as AvaliableProjectsResponse;
  }

  async getAvaliableVersions(project: ProjectType) {
    try {
      const response = await api.post<{ versions: string[] }>(
        Endpoints.GET_AVALIABLE_VERSIONS,
        {
          project: project,
        },
      );

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching available versions:", error);
      throw error;
    }
  }

  async importProject(project: string, version: string) {
    try {
      const response = await api.post<ImportProjectResponse>(
        Endpoints.IMPORT_PROJECT,
        {
          project,
          version,
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async openProject(project: string, mutationTool: string) {
    try {
      const response = await api.post<OpenProjectResponse>(
        Endpoints.OPEN_PROJECT,
        {
          project,
          tool: mutationTool,
        },
      );

      const {
        project: name,
        tool,
        table_header,
        sheet_data,
        metric_data,
        summary_data,
        test_class,
        dev_suite,
        coverage_data,
      } = response.data;

      return {
        name,
        mutationTool: tool,
        mutantTableHeaders: table_header,
        mutantSheetData: sheet_data,
        metricData: metric_data,
        mutationSummaryData: summary_data,
        testClass: test_class,
        devSuite: dev_suite,
        coverageData: coverage_data,
        killedMutants: [],
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async compileStudentCode(project: string, code: string) {
    try {
      const compilationMessage = await api.post(Endpoints.COMPILE_PROJECT, {
        project,
        code,
      });

      return {
        statusCode: compilationMessage.status,
        message: compilationMessage.data.message,
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        message: "Error compiling student code",
      };
    }
  }

  async analyzeProjectMutants(
    project: string,
    tool: string,
    studentCode?: string,
    withStudentTests = true,
    getMutationWithoutStudentSuite = false,
  ) {
    try {
      const response = await api.post(Endpoints.ANALYZE_MUTANTS, {
        project,
        tool,
        code: studentCode,
        withStudentTests,
        getMutationWithoutStudentSuite,
      });

      if (response.status === 204) {
        throw new Error("First mutation analysis already complete");
      }

      const { killed_list, summary_data, sheet_data, table_header } =
        response.data;

      return {
        killedMutants: killed_list,
        mutationSummaryData: summary_data,
        mutantSheetData: sheet_data,
        mutantTableHeaders: table_header,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async generateKillMatrix(project: string, tool: string, studentCode: string) {
    try {
      const response = await api.post(Endpoints.GENERATE_KILL_MATRIX, {
        project,
        tool,
        code: studentCode,
      });

      const { kill_matrix, all_killed_mutants } = response.data;

      return {
        killMatrix: kill_matrix,
        killMatrixHeaders: all_killed_mutants,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
