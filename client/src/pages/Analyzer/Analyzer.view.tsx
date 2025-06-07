import TabSelector from "../../components/TabSelector";
import DataTableComponent from "../../components/DataTable";

interface AnalyzerViewProps {
  focusOnTab: number | undefined;
  mutationTabs: { name: string; content: JSX.Element }[];
  testsTabs: { name: string; content: JSX.Element }[];
}

export const AnalyzerView = ({
  focusOnTab,
  mutationTabs,
  testsTabs,
}: AnalyzerViewProps) => {
  return (
    <div className=" flex-1 gap-4 p-4 grid md:grid-cols-2 h-screen">
      <div className="flex flex-col w-full">
        <TabSelector
          focusOnTabNumber={focusOnTab}
          tabs={mutationTabs}
        ></TabSelector>
        <div className="flex flex-col items-center justify-center w-full max-w-screen">
          <DataTableComponent />
        </div>
      </div>

      <TabSelector tabs={testsTabs} />
    </div>
  );
};
