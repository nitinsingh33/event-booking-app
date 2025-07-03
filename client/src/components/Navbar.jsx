import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold flex items-center space-x-2">
        <img src="ticket-2.png" alt="logo" className="h-6 w-6" />Event Booking
      </h1>
      <div className="space-x-2">
        <Link
          to="/"
          className={`px-3 py-2 rounded ${isActive("/") ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"}`}
        >
          Home
        </Link>
        <Link
          to="/register-event"
          className= "px-3 py-2 rounded hover:bg-gray-700"
        >
          Register Event
        </Link>

        {!user ? (
          <>
            <Link
              to="/signup"
              className={`px-3 py-2 rounded ${isActive("/signup") ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"}`}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={`px-3 py-2 rounded ${isActive("/login") ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"}`}
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <span className="text-green-300 font-medium">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
