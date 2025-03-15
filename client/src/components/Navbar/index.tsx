import { useCallback, useState } from "react";
import NavbarView from "./Navbar.view";
import { useNavigate } from "react-router";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const navigate = useNavigate();

  const handleHomeClick = useCallback(() => {
    navigate("/select-project");
  }, [navigate]);

  return (
    <NavbarView
      handleHomeClick={handleHomeClick}
      isOpen={isOpen}
      toggleNavbar={toggleNavbar}
    />
  );
}

export default Navbar;
