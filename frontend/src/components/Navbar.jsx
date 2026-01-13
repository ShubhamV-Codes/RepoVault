import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/RepoVault.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setShowLogoutModal(false);
    navigate("/auth");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="RepoVault Logo" className="navbar-logo" />
          <h3>RepoVault</h3>
        </Link>

        <div className="navbar-links">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <button onClick={handleLogoutClick} className="nav-link logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={cancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5l-1.97-1.97a.75.75 0 10-1.06 1.06l.72.72H6.25a.75.75 0 000 1.5h3.94l-.72.72a.75.75 0 101.06 1.06l1.97-1.97a.75.75 0 000-1.06z" />
              </svg>
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-modal-body">
              <p>Are you sure you want to logout from RepoVault?</p>
            </div>
            <div className="logout-modal-footer">
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="confirm-logout-btn" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;