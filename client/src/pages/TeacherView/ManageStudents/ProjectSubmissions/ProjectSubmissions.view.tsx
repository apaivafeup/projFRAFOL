import Accordion from "@components/Accordion";
import { Accordion as AccordionType } from "@components/Accordion/utils";

interface ProjectSubmissionViewProps {
  accordionData: AccordionType[];
  noSubmissionsFound: boolean;
}

function ProjectSubmissionsView({
  accordionData,
  noSubmissionsFound,
}: ProjectSubmissionViewProps) {
  if (noSubmissionsFound) return <p>No submissions found</p>;

  return <Accordion accordions={accordionData} />;
}

export default ProjectSubmissionsView;
