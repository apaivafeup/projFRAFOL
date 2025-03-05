import React from "react";
import TabSelector from "../../components/TabSelector";
import ManageStudents from "./ManageStudents/ManageStudents.view";
import ManageClasses from "./ManageClasses/ManageClasses.view";
import MutantMatrix from "./MutantMatrix";

function TeacherDashboard() {
  const tabs = [
    {
      name: "Manage Classes",
      content: <ManageClasses></ManageClasses>,
    },
    {
      name: "Student Submissions",
      content: <ManageStudents />,
    },
    {
      name: "Mutant Matrix",
      content: <MutantMatrix />,
    },
  ];

  return (
    <div className="flex flex-col p-6 pl-10 w-full h-screen">
      <TabSelector tabs={tabs}></TabSelector>
    </div>
  );
}

export default TeacherDashboard;
