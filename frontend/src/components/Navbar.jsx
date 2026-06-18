import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/dashboard">
        📚 LibraTrack
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav ms-auto align-items-lg-center">
          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/books">Books</Link>
              </li>
              {user.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/members">Members</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/borrowings">Borrowings</Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <span className="nav-link text-warning">
                  {user.name} ({user.role})
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm mt-1 mt-lg-0 ms-lg-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;