import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ScreenHeroProps {
  icon: IconDefinition;
  title: string;
  description: string;
}

function ScreenHero({ icon, title, description }: ScreenHeroProps) {
  return (
    <div className="flex flex-col items-center w-full justify-center">
      <FontAwesomeIcon icon={icon} size="6x" className="text-blue-500" />
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-gray-500 text-center">{description}</p>
    </div>
  );
}

export default ScreenHero;
