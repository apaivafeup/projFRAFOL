interface TextInputViewProps {
  icon?: React.ReactNode;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

export const TextInputView = ({
  icon,
  value,
  setValue,
  placeholder,
}: TextInputViewProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {icon && <div>{icon}</div>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="border-1 border-gray-200 hover:border-blue-200 focus:border-blue-500 p-2.5 text-lg w-80 rounded-xl custom-input"
      />
    </div>
  );
};
