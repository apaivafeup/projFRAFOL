interface SelectProjectDropdownViewProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  values: string[];
  width?: number;
}

function SelectProjectDropdownView({
  value,
  onChange,
  values,
  label,
  width,
}: SelectProjectDropdownViewProps) {
  console.log(value);
  return (
    <div className="mt-2 flex flex-col">
      <label className="text-black">{label}</label>
      <select
        name="select_project"
        className="border-1 border-gray-200 bg-white mt-2 text-black"
        id="select_menu_one"
        value={value}
        onChange={onChange}
        style={{ minWidth: width ? `${width}px` : "auto" }}
      >
        {values.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectProjectDropdownView;
