import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTools,
  faChartBar,
  faTable,
  faTrophy,
  faPersonChalkboard,
} from "@fortawesome/free-solid-svg-icons";

type Route =
  | "selectTool"
  | "analyzer"
  | "killMatrix"
  | "leaderboard"
  | "teacherView"
  | "studentView";

function NavbarView() {
  const navigate = useNavigate();

  const [selectedRoute, setSelectedRoute] = useState<Route>("selectTool");

  const handleHomeClick = useCallback(() => {
    setSelectedRoute("selectTool");
    navigate("/");
  }, [navigate]);

  const handleAnalyzerClick = useCallback(() => {
    setSelectedRoute("analyzer");
    navigate("/analyzer");
  }, [navigate]);

  const handleKillMatrixClick = useCallback(() => {
    setSelectedRoute("killMatrix");
    navigate("/kill-matrix");
  }, [navigate]);

  const handleTeacherViewClick = useCallback(() => {
    setSelectedRoute("teacherView");
    navigate("/teacher");
  }, [navigate]);

  const handleStudentViewClick = useCallback(() => {
    setSelectedRoute("studentView");
    navigate("/student");
  }, [navigate]);

  return (
    <div className="hidden md:min-w-1/10 border-r-1 h-screen fixed  shadow-md rounded-2xl border-r-gray-200 md:flex flex-col gap-3 text-black pt-4 p-1">
      <button
        className="font-semibold border-b-1 border-b-gray-200"
        style={{ paddingBottom: 8 }}
        onClick={handleHomeClick}
      >
        <div className="text-2xl hover:text-blue-500">FRAFOL</div>
      </button>
      <button
        style={{ borderRadius: 6 }}
        className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
          selectedRoute === "selectTool" ? "bg-blue-200" : ""
        }`}
        onClick={handleHomeClick}
      >
        <div
          className={` hover:text-blue-500 flex items-center ${
            selectedRoute === "selectTool" ? "text-blue-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTools} className="mr-2" />
          Select Tool
        </div>
      </button>
      <button
        style={{ borderRadius: 6 }}
        className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
          selectedRoute === "analyzer" ? "bg-blue-200" : ""
        }`}
        onClick={handleAnalyzerClick}
      >
        <div
          className={`hover:text-blue-500 flex items-center ${
            selectedRoute === "analyzer" ? "text-blue-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} className="mr-2" />
          Analyzer
        </div>
      </button>
      <button
        style={{ borderRadius: 6 }}
        className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
          selectedRoute === "killMatrix" ? "bg-blue-200" : ""
        }`}
        onClick={handleKillMatrixClick}
      >
        <div
          className={`hover:text-blue-500 flex items-center ${
            selectedRoute === "killMatrix" ? "text-blue-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTable} className="mr-2" />
          Kill Matrix
        </div>
      </button>
      <button
        style={{ borderRadius: 6 }}
        className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
          selectedRoute === "studentView" ? "bg-blue-200" : ""
        }`}
        onClick={() => {
          setSelectedRoute("studentView");
          navigate("/student");
        }}
      >
        <div
          className={`hover:text-blue-500 flex items-center ${
            selectedRoute === "studentView" ? "text-blue-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTrophy} className="mr-2" />
          Leaderboard
        </div>
      </button>
      <button
        style={{ borderRadius: 6 }}
        className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
          selectedRoute === "teacherView" ? "bg-blue-200" : ""
        }`}
        onClick={handleTeacherViewClick}
      >
        <div
          className={`hover:text-blue-500 flex items-center ${
            selectedRoute === "teacherView" ? "text-blue-600" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPersonChalkboard} className="mr-2" />
          Teacher View
        </div>
      </button>
    </div>
  );
}

export default NavbarView;
