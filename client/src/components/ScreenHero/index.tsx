import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import ScreenHeroView from "./ScreenHero.view";

interface ScreenHeroProps {
  icon: IconDefinition;
  title: string;
  description: string;
}

function ScreenHero({ icon, title, description }: ScreenHeroProps) {
  return <ScreenHeroView icon={icon} title={title} description={description} />;
}

export default ScreenHero;
