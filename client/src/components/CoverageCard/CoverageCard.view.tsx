interface CoverageCardViewProps {
  title: string;
  coverage: number;
  ratio: string;
}
function CoverageCardView({ title, coverage, ratio }: CoverageCardViewProps) {
  return (
    <div className="max-w-sm p-4 overflow-clip bg-white border border-gray-200 rounded-lg shadow-sm ">
      <h5 className="text-lg font-semibold overflow-ellipsis tracking-tight text-gray-500 ">
        {title}:
      </h5>
      <p className="mb-3 text-3xl overflow-ellipsis font-semibold  text-gray-900">
        {coverage}%
      </p>

      <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-800 «">{ratio}</span>
      </div>
    </div>
  );
}

export default CoverageCardView;
