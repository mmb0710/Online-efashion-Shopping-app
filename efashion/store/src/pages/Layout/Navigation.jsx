import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice.js";
import { logout } from "../../redux/features/authSlice.js";
import "./Navigation.css";
import Logo from "../../components/Logo.jsx";
import NavLinks from "./NavLinks.jsx";
import UserMenu from "./UserMenu.jsx";
import AuthLinks from "./AuthLinks.jsx";

const Navigation = () => {
  const location = useLocation();

  // ✅ Admin route check: don't render navigation bar for /admin pages
  const isAdminPath = location.pathname.startsWith("/admin");
  if (isAdminPath) return null;

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-black text-white fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Logo />
        <div className="hidden sm:block">
          <NavLinks handleLinkClick={handleLinkClick} />
        </div>
        <div className="relative">
          {userInfo ? (
            <UserMenu
              userInfo={userInfo}
              isDropdownOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              handleLinkClick={handleLinkClick}
              logoutHandler={logoutHandler}
            />
          ) : (
            <AuthLinks location={location} handleLinkClick={handleLinkClick} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
