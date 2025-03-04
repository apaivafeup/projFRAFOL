import React, { useMemo } from "react";
import { useTeacher } from "../../../../context/teacher";
import { CodeEditor } from "../../../../components/CodeEditor";
import Accordion from "../../../../components/Accordion";

function ProjectSubmissionsView() {
  const { currentProjectSubmissions } = useTeacher();
  const accordionData = useMemo(() => {
    if (!currentProjectSubmissions) return [];
    return currentProjectSubmissions.map((submission) => {
      return {
        title: submission.studentNumber,
        content: (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-semibold">Submission Date:</p>
              <p>{new Date(submission.submissionDate).toLocaleString()}</p>
              <p className="font-semibold">Killed Mutants</p>
              <p>{submission.killedMutants.length}</p>
            </div>
            <CodeEditor code={submission.code} />
          </div>
        ) as React.ReactNode,
      };
    });
  }, [currentProjectSubmissions]);

  if (!currentProjectSubmissions || currentProjectSubmissions.length === 0)
    return <p>No submissions found</p>;

  return <Accordion accordions={accordionData} />;
}

export default ProjectSubmissionsView;
