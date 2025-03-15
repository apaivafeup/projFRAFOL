import { ButtonBaseProps } from "@mui/material";
import ButtonView from "./Button.view";

interface ButtonProps extends ButtonBaseProps {
  title: string;
  onClick: VoidFunction;
  loading?: boolean;
  props?: object;
}

function Button({ title, onClick, loading, props }: ButtonProps) {
  return (
    <ButtonView title={title} onClick={onClick} loading={loading} {...props} />
  );
}

export default Button;
