import CoverageCardView from "./CoverageCard.view";

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
  return <CoverageCardView title={title} coverage={coverage} ratio={ratio} />;
};
