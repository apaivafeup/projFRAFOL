import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faChartBar,
  faTable,
  faPersonChalkboard,
  faUserAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import NavItem from "./components/NavItem";

interface NavbarViewProps {
  handleHomeClick: () => void;
  isOpen: boolean;
  toggleNavbar: () => void;
}

function NavbarView({
  handleHomeClick,
  isOpen,
  toggleNavbar,
}: NavbarViewProps) {
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 p-3 z-100">
        <button onClick={toggleNavbar}>
          <FontAwesomeIcon
            icon={isOpen ? faTimes : faBars}
            className="text-2xl"
          />
        </button>
      </div>
      <div
        className={`${isOpen ? "block" : "hidden"} lg:min-w-1/10 border-r-1 h-screen fixed bg-white shadow-md rounded-2xl z-90 border-r-gray-200 lg:flex lg:flex-col gap-3 text-black pt-4 p-1`}
      >
        <button
          className="font-semibold border-b-1 border-b-gray-200"
          style={{ paddingBottom: 8 }}
          onClick={handleHomeClick}
        >
          <div className="text-2xl hover:text-blue-500">FRAFOL</div>
        </button>
        <NavItem
          title="Select Project"
          icon={<FontAwesomeIcon icon={faTools} className="mr-2" />}
          route="select-project"
        />
        <NavItem
          title="Analyzer"
          icon={<FontAwesomeIcon icon={faChartBar} className="mr-2" />}
          route="analyzer"
        />
        <NavItem
          title="Kill Matrix"
          icon={<FontAwesomeIcon icon={faTable} className="mr-2" />}
          route="kill-matrix"
        />
        <NavItem
          title="Student"
          icon={<FontAwesomeIcon icon={faUserAlt} className="mr-2" />}
          route="student"
        />
        <NavItem
          title="Teacher View"
          icon={<FontAwesomeIcon icon={faPersonChalkboard} className="mr-2" />}
          route="teacher"
        />
      </div>
    </>
  );
}

export default NavbarView;
