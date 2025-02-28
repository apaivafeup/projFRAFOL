import { useCallback, useEffect, useState } from "react";

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
    <div className="flex flex-col w-full">
      <ul className="flex flex-wrap text-md font-medium text-center text-gray-500 border-b border-gray-200">
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className="me-2"
            onClick={() => {
              handleClick(tab);
            }}
          >
            <div
              className={`p-2 hover:bg-gray-200 rounded-t-lg ${currentTab.name === tab.name ? "bg-blue-100 text-blue-500" : "text-gray-500"}`}
              onClick={() => {
                handleClick(tab);
              }}
            >
              {tab.name}
            </div>
          </li>
        ))}
      </ul>
      <div>{currentTab.content}</div>
    </div>
  );
};

export default TabSelector;
