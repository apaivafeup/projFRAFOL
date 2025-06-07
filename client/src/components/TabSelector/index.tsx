import { useCallback, useEffect, useState } from "react";
import TabSelectorView from "./TabSelector.view";

export interface ITab {
  name: string;
  content: JSX.Element;
}

interface TabSelectorProps {
  tabs: ITab[];
  focusOnTabNumber?: number;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  focusOnTabNumber,
}) => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const handleClick = useCallback((tab: ITab) => {
    setCurrentTab(tab);
  }, []);

  useEffect(() => {
    setCurrentTab(tabs[0]);
  }, [tabs]);

  useEffect(() => {
    if (!focusOnTabNumber) return;
    setCurrentTab(tabs[focusOnTabNumber]);
  }, [focusOnTabNumber, tabs]);

  return (
    <TabSelectorView
      tabs={tabs}
      currentTab={currentTab}
      handleClick={handleClick}
    />
  );
};

export default TabSelector;
