import { useState } from "react";
import AccordionView from "./Accordion.view";
import { Accordion as IAccordion } from "./utils";

interface AccordionProps {
  accordions: IAccordion[];
}

function Accordion({ accordions }: AccordionProps) {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    false,
  );
  return (
    <AccordionView
      accordions={accordions}
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    />
  );
}

export default Accordion;
