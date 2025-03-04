import { useCallback } from "react";
import NavbarView from "./Navbar.view";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();

  const handleHomeClick = useCallback(() => {
    navigate("/select-project");
  }, [navigate]);

  return <NavbarView handleHomeClick={handleHomeClick} />;
}

export default Navbar;
