import { Circles } from "react-loader-spinner";

interface ButtonLoaderViewProps {
  height?: number;
  width?: number;
  color?: string;
}

const DEFAULT_HEIGHT = 24;
const DEFAULT_WIDTH = 36;
const DEFAULT_COLOR = "#ffffff";
function ButtonLoaderView({ width, height, color }: ButtonLoaderViewProps) {
  return (
    <Circles
      height={height || DEFAULT_HEIGHT}
      width={width || DEFAULT_WIDTH}
      color={color || DEFAULT_COLOR}
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass="items-center text-center justify-center"
      visible={true}
    />
  );
}

export default ButtonLoaderView;
