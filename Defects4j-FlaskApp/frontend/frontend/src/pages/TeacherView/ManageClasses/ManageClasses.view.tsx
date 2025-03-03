import { useCallback, useState } from "react";
import SelectSearch from "../../../components/SelectSearch";
import ListView from "../../../components/List/List.view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import { Modal } from "@mui/material";
import { addClass, admitStudent, deleteStudentAdmission as deleteStudent } from "../../../services/Firebase";
import { useSnackbar } from "../../../context/snackbar";
import { useTeacher } from "../../../context/teacher";
import Card from "../../../components/Card";

function ManageClasses() {
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassLoading, setNewClassLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { allClasses, refreshClasses, setCurrentClassName, currentClassName, currentClassAdmissions } =
    useTeacher();

  const classes = allClasses.map((className) => {
    return { name: className, value: className };
  });

  const deleteStudentAdmission = async (student: string) => {
    try {
      await deleteStudent(student, currentClassName);
      showSnackbar("Student admission removed successfully", "success");
      refreshClasses();
    } catch (e) {
      console.error("Error removing student admission", e);
      showSnackbar("Error removing student admission", "error");
    }
  }

  const acceptStudentAdmission = async (student: string) => {
    try {
      await admitStudent(student, currentClassName);
      showSnackbar("Student admitted successfully", "success");
      refreshClasses();
    } catch (e) {
      console.error("Error admitting student", e);
      showSnackbar("Error admitting student", "error");
    }
  }

  const listItems = currentClassAdmissions.map((student) => {
    return {
      title: student,
      onSuccess: acceptStudentAdmission,
      onDecline: deleteStudentAdmission,
      logo: <FontAwesomeIcon icon={faUser} width={24} height={24} />,
    };
  });

  const handleNewClass = useCallback(async () => {
    setNewClassLoading(true);
    try {
      await addClass(newClassName);
      showSnackbar("Class added successfully", "success");
      refreshClasses();
    } catch (e) {
      console.error("Error adding class", e);
      showSnackbar("Error adding class", "error");
    } finally {
      setNewClassLoading(false);
      setOpen(false);
    }
  }, [newClassName, refreshClasses, showSnackbar]);

  return (
    <div className="flex flex-col">
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
        <Button
          title="Add Class"
          onClick={() => {
            setOpen(true);
          }}
        ></Button>
      </div>
      <div className="grid grid-cols-6 gap-4 w-full mt-4">
        <Card title="Students" hero={"22"} />
        <Card title="Submissions" hero={"0"} />
        <Card title="Pending Requests" hero={currentClassAdmissions?.length.toString() || "0" } />
      </div>

      <ListView items={listItems} />
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl w-120">
          <div>Input new class name</div>
          <input
            type="text"
            className="p-3 rounded-lg border-gray-200 border-1 hover:border-blue-500"
            value={newClassName}
            placeholder="Insert class name"
            onChange={(e) => {
              setNewClassName(e.target.value);
            }}
          />
          <Button
            title="Add"
            loading={newClassLoading}
            onClick={handleNewClass}
          ></Button>
        </div>
      </Modal>
    </div>
  );
}

export default ManageClasses;
