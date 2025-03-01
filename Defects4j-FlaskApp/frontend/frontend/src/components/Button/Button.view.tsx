import React from 'react'
import { ButtonLoader } from '../ButtonLoader';

interface ButtonViewProps {
    title: string;
    onClick: VoidFunction;
    loading?: boolean;
}

function ButtonView({title, onClick, loading} : ButtonViewProps) {
  return (
    <button
    onClick={onClick}
    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:scale-110 ease-in duration-200"
    >
        {loading ? <ButtonLoader /> : title}
    </button>
  )
}

export default ButtonView