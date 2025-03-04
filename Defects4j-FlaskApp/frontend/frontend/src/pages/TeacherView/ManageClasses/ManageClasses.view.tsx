import SelectSearch from "@components/SelectSearch";
import { useTeacher } from "@context/teacher";
import Card from "@components/Card";
import PendingStudents from "./components/PendingStudents";
import CurrentStudents from "./components/CurrentStudents";
import AddClassModal from "./components/AddClassModal";

function ManageClasses() {
  const { allClasses,  setCurrentClassName, currentClassName, currentClassAdmissions, currentProjectSubmissions, currentClassStudents } =
    useTeacher();

  const classes = allClasses.map((className) => {
    return { name: className, value: className };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center text-black">
        <label className="text-xl font-semibold" htmlFor="">
          Class:
        </label>
        <SelectSearch
          selection={currentClassName}
          handleSelection={setCurrentClassName}
          options={classes}
          placeholder="Select Class name"
        ></SelectSearch>
        <AddClassModal />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 w-full">
        <Card title="Students" hero={currentClassStudents?.length.toString() || "0"} />
        <Card title="Submissions" hero={currentProjectSubmissions?.length.toString() || "0"} />
        <Card title="Pending Requests" hero={currentClassAdmissions?.length.toString() || "0" } />
      </div>
        <PendingStudents />
        <CurrentStudents />

    </div>
  );
}

export default ManageClasses;
