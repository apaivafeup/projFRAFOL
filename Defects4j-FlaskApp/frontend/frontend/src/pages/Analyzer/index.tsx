import { useEffect, useMemo, useState } from "react";
import { AnalyzerView } from "./Analyzer.view";
import { MutationCoverage } from "./components/MutationCoverage";
import { CodeEditor } from "@components/CodeEditor";
import { useCurrentProject } from "@context/currentProject";

function Analyzer() {
  const {
    currentProject,
    studentCode,
    setStudentCode,
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
    <AnalyzerView
      focusOnTab={focusOnTab}
      mutationTabs={mutationTabs}
      testsTabs={testsTabs}
    />
  );
}

export default Analyzer;
