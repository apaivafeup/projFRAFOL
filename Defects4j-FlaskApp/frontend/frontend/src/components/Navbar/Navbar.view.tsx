import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faChartBar,
  faTable,
  faPersonChalkboard,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import NavItem from "./components/NavItem";

interface NavbarViewProps { 
  handleHomeClick: () => void;
}

function NavbarView( { handleHomeClick }: NavbarViewProps) {
  return (
    <div className="hidden md:min-w-1/10 border-r-1 h-screen fixed  shadow-md rounded-2xl border-r-gray-200 md:flex flex-col gap-3 text-black pt-4 p-1">
      <button
        className="font-semibold border-b-1 border-b-gray-200"
        style={{ paddingBottom: 8 }}
        onClick={handleHomeClick}
      >
        <div className="text-2xl hover:text-blue-500">FRAFOL</div>
      </button>
      <NavItem title="Select Project" icon={<FontAwesomeIcon icon={faTools} className="mr-2" />} route="select-project"/>
      <NavItem title="Analyzer" icon={<FontAwesomeIcon icon={faChartBar} className="mr-2" />} route="analyzer"/>
      <NavItem title="Kill Matrix" icon={<FontAwesomeIcon icon={faTable} className="mr-2" />} route="kill-matrix" />
      <NavItem title="Student" icon={<FontAwesomeIcon icon={faUserAlt} className="mr-2" />} route="student"/>
      <NavItem title="Teacher View" icon={<FontAwesomeIcon icon={faPersonChalkboard} className="mr-2" />} route="teacher"/>
    </div>
  );
}

export default NavbarView;
