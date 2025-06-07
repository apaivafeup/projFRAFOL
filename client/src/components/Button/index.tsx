import { ButtonBaseProps } from "@mui/material";
import ButtonView from "./Button.view";

interface ButtonProps extends ButtonBaseProps {
  title: string;
  onClick: VoidFunction;
  loading?: boolean;
  isDisabled?: boolean;
}

function Button({ title, onClick, loading, ...rest }: ButtonProps) {
  return (
    <ButtonView title={title} onClick={onClick} loading={loading} {...rest} />
  );
}

export default Button;
