// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut, Map, Home, Book, Star } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
    closeDropdown();
  };
  

  // Check if current path matches
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <nav 
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white shadow-header py-3' 
      : location.pathname === '/'
        ? 'bg-transparent py-5'
        : 'bg-white border-b border-gray-200 py-3'
  }`}
>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2" 
            onClick={closeMenu}
          >
            <img 
              src="/logo.png" 
              alt="Tourly Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className={`font-display font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-black'}`}>
              Tourly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              active={isActive('/')} 
              icon={<Home size={16} />}
              isScrolled={isScrolled}
            >
              Home
            </NavLink>
            <NavLink 
              to="/places" 
              active={isActive('/places')} 
              icon={<Map size={16} />}
              isScrolled={isScrolled}
            >
              Places
            </NavLink>
            <NavLink 
              to="/tours" 
              active={isActive('/tours')} 
              icon={<Book size={16} />}
              isScrolled={isScrolled}
            >
              Tours
            </NavLink>
            
            {/* Authentication */}
            <div className="ml-6 flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-1 rounded-full px-3 py-2 font-medium text-sm transition ${
                      isDropdownOpen 
                        ? 'bg-gray-100' 
                        : isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                    } ${isScrolled ? 'text-gray-900' : 'text-black'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user?.name || user?.username}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                      isScrolled 
                        ? 'text-primary-600 hover:bg-primary-50' 
                        : 'text-black hover:bg-white/10'
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-black hover:bg-primary-600 transition shadow-button hover:shadow-button-hover"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden text-${isScrolled ? 'gray-900' : 'white'} focus:outline-none`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-4 rounded-lg shadow-lg p-4 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <MobileNavLink to="/" active={isActive('/')} onClick={closeMenu}>
                <Home size={18} className="mr-2" />
                Home
              </MobileNavLink>
              <MobileNavLink to="/places" active={isActive('/places')} onClick={closeMenu}>
                <Map size={18} className="mr-2" />
                Places
              </MobileNavLink>
              <MobileNavLink to="/tours" active={isActive('/tours')} onClick={closeMenu}>
                <Book size={18} className="mr-2" />
                Tours
              </MobileNavLink>
              
              <hr className="my-2" />
              
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 rounded-md bg-gray-50">
                    <div className="font-medium text-gray-900 mb-1">
                      {user?.name || user?.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                  <MobileNavLink to="/profile" active={isActive('/profile')} onClick={closeMenu}>
                    <User size={18} className="mr-2" />
                    Profile
                  </MobileNavLink>
                 
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 text-danger-600 hover:bg-danger-50 rounded-md transition"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 text-center rounded-md bg-primary-500 text-black hover:bg-primary-600 transition"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
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
  icon?: React.ReactNode;
  isScrolled: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children, icon, isScrolled }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition ${
      active 
        ? isScrolled ? 'bg-primary-50 text-primary-600' : 'bg-white/20 text-black' 
        : isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-black/90 hover:bg-white/10'
    }`}
  >
    {icon && icon}
    <span>{children}</span>
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, active, onClick, children }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md transition ${
      active ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;