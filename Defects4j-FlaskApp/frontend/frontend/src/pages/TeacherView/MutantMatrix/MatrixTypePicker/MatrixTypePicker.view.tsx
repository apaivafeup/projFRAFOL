import SelectSearch from "@components/SelectSearch";

interface MatrixTypePickerViewProps {
  matrixType: string;
  setMatrixType: (matrixType: string) => void;
  types: { name: string; value: string }[];
}

function MatrixTypePickerView({
  matrixType,
  setMatrixType,
  types,
}: MatrixTypePickerViewProps) {
  return (
    <div className="flex flex-row gap-2 items-center text-black">
      <label
        className="text-xl font-semibold lg:min-w-auto min-w-30"
        htmlFor=""
      >
        Matrix Type:
      </label>
      <SelectSearch
        selection={matrixType}
        handleSelection={setMatrixType}
        options={types}
        placeholder="Select Project"
      ></SelectSearch>
    </div>
  );
}

export default MatrixTypePickerView;
