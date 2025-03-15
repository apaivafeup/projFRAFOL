import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";

export interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  expanded: boolean;
  onChange: () => void;
  index: number;
}

function AccordionItemView({
  title,
  expanded,
  onChange,
  content,
  index,
}: AccordionItemProps) {
  return (
    <div className="flex flex-col">
      <Accordion expanded={expanded} onChange={onChange} className="w-full">
        <AccordionSummary
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>{content}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export default AccordionItemView;
