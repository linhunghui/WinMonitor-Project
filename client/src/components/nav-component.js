import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service.js";

function NavComponent(props) {
  let { currentUser, setCurrentUser } = props;
  const Navigate = useNavigate();
  const handleLogout = () => {
    AuthService.logout();
    window.alert("logout successfully.You are redirect to the home page.");
    setCurrentUser(null);
    Navigate("/");
  };
  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>
                {currentUser && currentUser.user.role == "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                )}
                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/monitor">
                      Monitor
                    </Link>
                  </li>
                )}
                {currentUser && currentUser.user.role == "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/postMachine">
                      Add Machine
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link onClick={handleLogout} className="nav-link" to="/">
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
}

export default NavComponent;
