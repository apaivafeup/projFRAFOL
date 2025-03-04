import { Route, useNavbar } from '@context/navbar';
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router';

interface NavItemProps {
    title: string
    icon: React.ReactNode
    route: Route;
}

function NavItem( { title, icon, route }: NavItemProps ) {
    const { currentRoute, setCurrentRoute } = useNavbar();
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        setCurrentRoute(route);
        navigate(`/${route}`);
    }, [route, setCurrentRoute, navigate]);

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
  )
}

export default NavItem