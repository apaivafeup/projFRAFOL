import ButtonView from "./Button.view";

interface ButtonProps {
  title: string;
  onClick: VoidFunction;
  loading?: boolean;
  props?: object;
}

function Button({ title, onClick, loading, props }: ButtonProps) {
  return <ButtonView title={title} onClick={onClick} loading={loading} {...props} />;
}

export default Button;
