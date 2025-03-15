import ButtonLoaderView from "./ButtonLoader.view";

interface ButtonLoaderProps {
  height?: number;
  width?: number;
  color?: string;
}

export const ButtonLoader = ({ width, height, color }: ButtonLoaderProps) => {
  return <ButtonLoaderView width={width} height={height} color={color} />;
};
