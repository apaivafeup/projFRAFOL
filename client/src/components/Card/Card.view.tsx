interface CardViewProps {
  title: string;
  hero: string;
  label?: string;
}

function CardView({ title, hero, label }: CardViewProps) {
  return (
    <div className="max-w-sm p-4 overflow-clip bg-white border border-gray-200 rounded-lg shadow-sm ">
      <h5 className="text-lg font-semibold overflow-ellipsis tracking-tight text-gray-500 ">
        {title}
      </h5>
      <p className="mb-3 text-3xl overflow-ellipsis font-semibold  text-gray-900">
        {hero}
      </p>
      <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-800 «">{label}</span>
      </div>
    </div>
  );
}

export default CardView;
