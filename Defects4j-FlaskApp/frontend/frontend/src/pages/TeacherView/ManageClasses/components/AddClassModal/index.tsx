import { useCallback, useState } from "react";
import AddClassModalView from "./AddClassModal.view";
import { useSnackbar } from "@context/snackbar";
import { addClass } from "@services/Firebase";
import { useTeacher } from "@context/teacher";

function AddClassModal() {

    const [open, setOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassLoading, setNewClassLoading] = useState(false);
  
    const { showSnackbar } = useSnackbar();
    const { refreshClasses } = useTeacher();

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
    <AddClassModalView 
        open={open} 
        setOpen={setOpen} 
        newClassName={newClassName} 
        setNewClassName={setNewClassName} 
        handleNewClass={handleNewClass} 
        newClassLoading={newClassLoading}
    />
  )
}

export default AddClassModal