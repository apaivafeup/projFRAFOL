import Button from "@components/Button";
import { Modal } from "@mui/material";

interface AddClassModalViewProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  newClassName: string;
  setNewClassName: (value: string) => void;
  newClassLoading: boolean;
  handleNewClass: () => void;
}

function AddClassModalView({
  open,
  setOpen,
  newClassName,
  setNewClassName,
  newClassLoading,
  handleNewClass,
}: AddClassModalViewProps) {
  return (
    <>
      <Button
        title="Add Class"
        onClick={() => {
          setOpen(true);
        }}
      ></Button>
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
    </>
  );
}

export default AddClassModalView;
