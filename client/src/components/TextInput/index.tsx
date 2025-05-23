import { TextInputView } from "./TextInput.view";

interface TextInputProps {
  icon?: React.ReactNode;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}
export const TextInput = ({
  icon,
  value,
  setValue,
  placeholder,
}: TextInputProps) => {
  return (
    <TextInputView
      icon={icon}
      value={value}
      setValue={setValue}
      placeholder={placeholder}
    />
  );
};
