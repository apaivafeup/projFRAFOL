import { useCurrentProject } from "../../context";
import CurrentProjectHeaderView from "./CurrentProjectHeader.view";

function CurrentProjectHeader() {
  const { currentProject } = useCurrentProject();

  return <CurrentProjectHeaderView currentProject={currentProject} />;
}

export default CurrentProjectHeader;
