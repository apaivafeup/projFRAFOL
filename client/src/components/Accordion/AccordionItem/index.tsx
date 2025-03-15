import React from "react";
import AccordionItemView from "./AccordionItem.view";

interface AccordionProps {
  expanded: boolean;
  onChange: () => void;
  title: string;
  content: React.ReactNode;
  index: number;
}

function AccordionItem({
  expanded,
  onChange,
  title,
  content,
  index,
}: AccordionProps) {
  return (
    <AccordionItemView
      expanded={expanded}
      onChange={onChange}
      title={title}
      content={content}
      index={index}
    />
  );
}

export default AccordionItem;
