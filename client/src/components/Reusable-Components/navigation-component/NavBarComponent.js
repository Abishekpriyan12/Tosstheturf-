import React, { useState, useEffect } from "react";
import "./NavBarComponent.css";
import { NavLink, useNavigate } from "react-router-dom";
import ButtonComponent from "../Button-Component/ButtonComponent";

const NavBarComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Track user role
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Track mobile menu state

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("role");
    setIsLoggedIn(!!username); // Set login status
    setRole(userRole); // Set user role
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole(null); // Reset role on logout
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  // Determine nav items based on role
  const getNavItems = () => {
    if (role === "User") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Turf Search", url: "/turfSearch" },
        { id: 3, name: "My Profile", url: "/user" },
        { id: 4, name: "Contact Us", url: "/contact" },
        { id: 5, name: "About Us", url: "/about" },
      ];
    } else if (role === "Admin") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Admin Dashboard", url: "/adminDashboard" },
        { id: 3, name: "Booking History", url: "/bookinghistory" },
        { id: 4, name: "Manage Turfs", url: "/displayturf" },
        { id: 5, name: "My Profile", url: "/user" },
      ];
    } else if (role === "Owner") {
      return [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Owner Dashboard", url: "/ownerDashboard" },
        { id: 3, name: "Add Turf", url: "/addTurf" },
        { id: 4, name: "My Profile", url: "/user" },
        { id: 5, name: "Contact Us", url: "/contact" },
        { id: 6, name: "About Us", url: "/about" },
      ];
    }
    // Default for unauthenticated users
    return [
      { id: 1, name: "Home", url: "/" },
      { id: 4, name: "Contact Us", url: "/contact" },
      { id: 5, name: "About Us", url: "/about" },
    ];
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="Nav-bar">
      <div className="card-container">
        <div className="Logo">
          <img src="ttt_logo.png" alt="logo" />
        </div>

        <div className="nav-links">
          <ul className={isMobileMenuOpen ? "active" : ""}>
            {getNavItems().map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            <div id="button-comp" className="dropdown">
              <ButtonComponent
                btnName={isLoggedIn ? "Logout" : "Login"}
                iconPath={isLoggedIn ? "user.png" : "user.png"}
                onClick={handleAuthClick}
              />
            </div>
            <div id="button-comp" className="dropdown">
              <ButtonComponent
                btnName={"Sign In"}
                iconPath={isLoggedIn ? "user.png" : "user.png"}
                className={isLoggedIn ? "signButton" :"button"}
                onClick={handleAuthClick}
              />
            </div>
          </ul>
          {/* Mobile menu icon */}
          <div className="menu-icon" onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
