import ButtonView from './Button.view';

interface ButtonProps {
    title: string;
    onClick: VoidFunction;
    loading?: boolean;
}

function Button({title, onClick, loading}: ButtonProps) {
  return (
     <ButtonView title={title} onClick={onClick} loading={loading}/>
  )
}

export default Button