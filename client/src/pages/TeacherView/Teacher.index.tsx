import TabSelector from "@components/TabSelector";

import MutantMatrix from "./MutantMatrix";
import ManageClasses from "./ManageClasses";
import ManageStudents from "./ManageStudents";

function TeacherDashboard() {
  const tabs = [
    {
      name: "Manage Classes",
      content: <ManageClasses />,
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
    <div className="flex flex-col p-6 md:pl-10 w-full h-screen">
      <TabSelector tabs={tabs}></TabSelector>
    </div>
  );
}

export default TeacherDashboard;
