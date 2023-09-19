import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { clearUser } from "../reducers/userReducer";
import "./../css/layout.scss";

const Layout = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  useEffect(() => {
    console.log("user ", user);
    if (!user && location.pathname !== "/" && location.pathname !== "/about") {
      navigate("/login");
    }
  }, [user, location]);

  return (
    <div className="main-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            PRAGATI
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/parking">
                  Parking
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/space">
                  Spaces
                </Link>
              </li>
              {user?.type !== "seeker" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/parkingForm">
                      Create Parking
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/spaceForm">
                      Create Space
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/booking">
                  Bookings
                </Link>
              </li>
              {user?.type === "admin" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">
                      Users
                    </Link>
                  </li>
                </>
              )}
              {user ? (
                <>
                  <li className="nav-item ms-2">
                    <Link className="nav-link" to="/profile">
                      <div className="bg-dark px-3 py-2 rounded-circle pointer">
                        {user?.name && user?.name[0]}
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item ms-2">
                    <button
                      className="btn btn-outline-info"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-info" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
