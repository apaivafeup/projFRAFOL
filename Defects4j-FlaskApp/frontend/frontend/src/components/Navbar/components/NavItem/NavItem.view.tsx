interface NavItemViewProps {
  icon: React.ReactNode;
  title: string;
  route: string;
  currentRoute: string;
  handleClick: () => void;
}

function NavItemView({
  icon,
  title,
  route,
  currentRoute,
  handleClick,
}: NavItemViewProps) {
  return (
    <button
      style={{ borderRadius: 6 }}
      className={`p-1 rounded-2xl font-semibold hover:bg-blue-200 items-start flex ${
        currentRoute === route ? "bg-blue-200" : ""
      }`}
      onClick={handleClick}
    >
      <div
        className={` hover:text-blue-500 flex items-center ${
          currentRoute === route ? "text-blue-600" : ""
        }`}
      >
        {icon}
        {title}
      </div>
    </button>
  );
}

export default NavItemView;
