import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold flex items-center space-x-2">
        <img src="ticket-2.png" alt="logo" className='h-6 w-6' />Event Booking</h1>
      <div className="space-x-2">
        <Link
          to="/"
          className={`px-3 py-2 rounded ${isActive("/") ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-700"}`}
        >
          Home
        </Link>
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
      </div>
    </nav>
  );
}
