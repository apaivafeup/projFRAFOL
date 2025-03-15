import { Route, useNavbar } from "@context/navbar";
import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import NavItemView from "./NavItem.view";

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  route: Route;
}

function NavItem({ title, icon, route }: NavItemProps) {
  const { currentRoute, setCurrentRoute } = useNavbar();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    setCurrentRoute(route);
    navigate(`/${route}`);
  }, [route, setCurrentRoute, navigate]);

  return (
    <NavItemView
      title={title}
      icon={icon}
      route={route}
      currentRoute={currentRoute}
      handleClick={handleClick}
    />
  );
}

export default NavItem;
