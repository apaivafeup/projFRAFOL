import { CodeEditor } from "../../components/CodeEditor";
import TabSelector from "../../components/TabSelector";
import { MutationCoverage } from "./components/MutationCoverage";
import { useCurrentProject } from "../../context";
import { useEffect, useMemo, useState } from "react";
import DataTableComponent from "../../components/DataTable";

export const AnalyzerView = () => {
  const {
    currentProject,
    studentCode,
    setStudentCode,
    excludeKilledMutants,
    jumpToLineNumberOnClassUnderMutation,
  } = useCurrentProject();
  const [focusOnTab, setFocusOnTab] = useState<number | undefined>(undefined);

  const testsTabs = useMemo(
    () => [
      {
        name: "Student Tests",
        content: (
          <CodeEditor code={studentCode} setCode={setStudentCode} editable />
        ),
      },
      {
        name: "Developer Tests",
        content: <CodeEditor code={currentProject?.devSuite} />,
      },
    ],
    [currentProject?.devSuite, setStudentCode, studentCode],
  );

  const mutationTabs = useMemo(
    () => [
      {
        name: "Mutation Data",
        content: <MutationCoverage />,
      },
      {
        name: "Class under Mutation",
        content: (
          <CodeEditor
            jumpToLine
            code={currentProject?.testClass}
            coverageData={currentProject?.coverageData}
          />
        ),
      },
    ],
    [currentProject?.coverageData, currentProject?.testClass],
  );

  useEffect(() => {
    if (jumpToLineNumberOnClassUnderMutation) {
      setFocusOnTab(1);
      setTimeout(() => {
        setFocusOnTab(undefined);
      }, 1000);
    }
  }, [jumpToLineNumberOnClassUnderMutation]);

  return (
    <div className=" flex-1 gap-4 p-4 grid md:grid-cols-2 h-screen">
      <div className="flex flex-col w-full">
        <TabSelector
          focusOnTabNumber={focusOnTab}
          tabs={mutationTabs}
        ></TabSelector>
        <DataTableComponent />
      </div>

      <TabSelector tabs={testsTabs} />
    </div>
  );
};
