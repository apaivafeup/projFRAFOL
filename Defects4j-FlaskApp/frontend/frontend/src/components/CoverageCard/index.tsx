interface CoverageCardProps {
  title: string;
  coverage: number;
  ratio: string;
}
export const CoverageCard: React.FC<CoverageCardProps> = ({
  title,
  coverage,
  ratio,
}) => {
  return (
    <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm ">
      <h5 className="text-lg font-semibold tracking-tight text-gray-500 ">
        {title}:
      </h5>
      <p className="mb-3 text-3xl font-semibold  text-gray-900">{coverage}%</p>

      <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-800 «">{ratio}</span>
      </div>
    </div>
  );
};
