import ManageClassesView from "./ManageClasses.view";
import { useTeacher } from "@context/teacher";

function ManageClasses() {
  const {
    allClasses,
    setCurrentClassName,
    currentClassName,
    currentClassAdmissions,
    currentProjectSubmissions,
    currentClassStudents,
  } = useTeacher();

  const classes = allClasses.map((className) => {
    return { name: className, value: className };
  });

  return (
    <ManageClassesView
      currentClassName={currentClassName}
      setCurrentClassName={setCurrentClassName}
      classes={classes}
      currentClassStudents={currentClassStudents}
      currentProjectSubmissions={currentProjectSubmissions}
      currentClassAdmissions={currentClassAdmissions}
    />
  );
}

export default ManageClasses;
