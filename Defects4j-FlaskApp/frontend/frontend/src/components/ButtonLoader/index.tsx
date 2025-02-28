import { Circles } from "react-loader-spinner";

export const ButtonLoader = () => {
  return (
    <Circles
      height="24"
      width="36"
      color="#ffffff"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass="items-center text-center justify-center"
      visible={true}
    />
  );
};
