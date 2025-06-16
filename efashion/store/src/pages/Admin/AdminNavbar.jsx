import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import UserMenu from "../Layout/UserMenu";
import { logout } from "../../redux/features/authSlice";
import { useLogoutMutation } from "../../redux/api/userApiSlice"; // ✅ Import mutation

const AdminNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation(); // ✅ Hook for API logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleLinkClick = () => setIsDropdownOpen(false);

  // ✅ Full logout flow: API -> Redux -> Navigate
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();      // 1. Clear cookie/session from server
      dispatch(logout());                  // 2. Clear Redux/localStorage
      navigate("/login");                  // 3. Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-gray-900 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/admin/dashboard"
          className="text-2xl font-bold tracking-wide hover:text-pink-400"
        >
          Tiraa
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-6 ml-6">
          <Link
            to="/admin/dashboard"
            className="hover:text-pink-400 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/userlist"
            className="hover:text-pink-400 font-medium"
          >
            User List
          </Link>
          <Link
            to="/admin/allproductslist"
            className="hover:text-pink-400 font-medium"
          >
            All Products
          </Link>
        </nav>

        {/* User Dropdown */}
        <div className="relative">
          <UserMenu
            userInfo={userInfo}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            handleLinkClick={handleLinkClick}
            logoutHandler={logoutHandler} // ✅ Passed here
          />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
