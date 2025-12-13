import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <div className="nav-shell">
      <nav>
        <Link to="/" className="nav-brand">
          <img className="nav-logo" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
          <span>GitPub</span>
        </Link>
        <div className="nav-links">
          {isLoggedIn && (
            <>
              <Link to="/repos">Repositories</Link>
              <Link to="/issues">Issues</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
