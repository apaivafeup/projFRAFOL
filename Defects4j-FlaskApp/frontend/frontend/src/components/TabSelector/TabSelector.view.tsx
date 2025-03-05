interface TabSelectorViewProps {
  tabs: { name: string; content: JSX.Element }[];
  currentTab: { name: string; content: JSX.Element };
  handleClick: (tab: { name: string; content: JSX.Element }) => void;
}

function TabSelectorView({
  tabs,
  currentTab,
  handleClick,
}: TabSelectorViewProps) {
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
}

export default TabSelectorView;
