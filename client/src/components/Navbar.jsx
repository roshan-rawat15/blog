import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Added Book icon for logo
import logo from '../assets/blog-icon.svg'

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let lastScrollY = window.scrollY;

  // Handle scroll event to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    setMessage({ type: "success", text: "Logged out successfully!" });
    navigate("/");
    setTimeout(() => {
      setMessage(null);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`bg-white shadow-lg p-4 fixed w-full top-0 z-20 transition-transform duration-300 ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo with Icon */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <img src={logo} alt="BlogSite Logo" className="h-8 w-8" />
            <span>BlogSite</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {user ? (
              <>
                <Link
                  to="/"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  About
                </Link>

                <Link
                  to="/contactus"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  Contact Us
                </Link>
                <span className="text-gray-700 font-medium underline">
                  Hello, {user.firstName}
                </span>
                <Link
                  to="/create"
                  className="px-4 py-2 text-blue-500 font-semibold border border-blue-500 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  Create Post
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-purple-500 font-semibold border border-purple-500 rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 font-semibold border rounded-lg shadow-md transition duration-300 ${
                    isLoading
                      ? "border-gray-400 text-gray-400 cursor-not-allowed opacity-50"
                      : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  About
                </Link>

                <Link
                  to="/contactus"
                  className="font-semibold text-black relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full hover:text-blue-600"
                >
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 border border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col items-center bg-white py-4 space-y-4 shadow-md">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hello, {user.firstName}
                </span>
                <Link to="/create" className="text-blue-500 font-semibold">
                  Create Post
                </Link>
                <Link to="/contactus" className="text-yellow-700 font-semibold">
                  Contact Us
                </Link>
                <Link to="/about" className="text-blue-500 font-semibold">
                  About
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-purple-500 font-semibold">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-sky-500 font-semibold">
                  Home
                </Link>
                <Link to="/about" className="text-sky-500 font-semibold">
                  About
                </Link>
                <Link to="/contactus" className="text-blue-500 font-semibold">
                  Contact Us
                </Link>
                <Link to="/login" className="text-blue-500 font-semibold">
                  Login
                </Link>
                <Link to="/register" className="text-green-500 font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Failure Message */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-md text-white transition ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </>
  );
}

export default Navbar;