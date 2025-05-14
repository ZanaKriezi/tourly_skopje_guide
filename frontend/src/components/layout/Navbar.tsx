// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

  const handleLogout = (): void => {
    logout();
    closeMenu();
  };

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="font-bold text-xl">Skopje Tourism Guide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <NavLink to="/" active={isActive("/")}>
                Home
              </NavLink>
              <NavLink to="/places" active={isActive("/places")}>
                Places
              </NavLink>
              <NavLink to="/tours" active={isActive("/tours")}>
                Tours
              </NavLink>
            </div>

            {/* Authentication Buttons */}
            <div className="flex space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-white">
                    {user?.name ? `Hi, ${user.name}` : `Hi, ${user?.username}`}
                  </span>
                  <div className="relative group">
                    <button className="flex items-center space-x-1 focus:outline-none">
                      <span>My Account</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-reviews"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Reviews
                      </Link>
                      {/* Add other account-related links here */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-white hover:bg-white/10"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <MobileNavLink to="/" active={isActive("/")} onClick={closeMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/places"
                active={isActive("/places")}
                onClick={closeMenu}
              >
                Places
              </MobileNavLink>
              <MobileNavLink
                to="/tours"
                active={isActive("/tours")}
                onClick={closeMenu}
              >
                Tours
              </MobileNavLink>
              <MobileNavLink
                to="/my-reviews"
                active={isActive("/my-reviews")}
                onClick={closeMenu}
              >
                My Reviews
              </MobileNavLink>
            </div>

            {/* Mobile Authentication */}
            <div className="mt-4 pt-4 border-t border-white/20 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <span className="text-white mb-2">
                    {user?.name ? `Hi, ${user.name}` : `Hi, ${user?.username}`}
                  </span>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      fullWidth
                      className="text-white border-white hover:bg-white/10 mb-2"
                    >
                      Profile
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    fullWidth
                    className="text-white border-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      fullWidth
                      className="text-white border-white hover:bg-white/10"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      fullWidth
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper Components
interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`transition-colors hover:text-white/80 ${
      active ? "font-semibold border-b-2 border-white" : ""
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  active,
  onClick,
  children,
}) => (
  <Link
    to={to}
    className={`py-2 transition-colors hover:text-white/80 ${
      active ? "font-semibold" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
