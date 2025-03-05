import SelectProjectDropdownView from "./SelectProjectDropdown.view";

interface SelectProjectDropdownProps {
  label: string;
  values: string[];
  width?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
function SelectProjectDropdown({
  values,
  label,
  width,
  value,
  onChange,
}: SelectProjectDropdownProps) {
  return (
    <SelectProjectDropdownView
      value={value}
      onChange={onChange}
      values={values}
      label={label}
      width={width}
    />
  );
}

export default SelectProjectDropdown;
