import { Suspense } from "react";
import AccordionItem from "./AccordionItem";
import { Accordion } from "./utils";

interface AccordionViewProps {
  expandedAccordion: string | false;
  setExpandedAccordion: (value: string | false) => void;
  accordions: Accordion[];
}
function AccordionView({
  accordions,
  expandedAccordion,
  setExpandedAccordion,
}: AccordionViewProps) {
  return (
    <div className="flex flex-col w-full gap-1">
      {accordions.map((accordion, index) => (
        <Suspense
          fallback={
            <div className="flex w-full p-2 bg-gray-200">Loading...</div>
          }
        >
          <AccordionItem
            key={index}
            expanded={expandedAccordion === `panel${index}`}
            onChange={() => {
              setExpandedAccordion(
                expandedAccordion === `panel${index}` ? false : `panel${index}`,
              );
            }}
            title={accordion.title}
            content={accordion.content}
            index={index}
          />
        </Suspense>
      ))}
    </div>
  );
}

export default AccordionView;
