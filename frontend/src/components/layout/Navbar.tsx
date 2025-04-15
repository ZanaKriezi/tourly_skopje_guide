import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Add scroll listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMenu();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary bg-opacity-95 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="font-montserrat text-xl font-bold text-white">Skopje Tourism Guide</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/places" active={isActive('/places')}>Places</NavLink>
              <NavLink to="/tours" active={isActive('/tours')}>Tours</NavLink>
              <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            </div>
            
            {/* Authentication Buttons */}
            <div className="flex space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="font-poppins text-white">
                    Hi, {user?.name || user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-white border-white hover:bg-white hover:bg-opacity-10"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-black border-white hover:bg-white hover:bg-opacity-10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      variant="accent" 
                      size="sm"
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
          <div className="md:hidden mt-3 py-3 border-t border-white border-opacity-20">
            <div className="flex flex-col space-y-3">
              <MobileNavLink to="/" active={isActive('/')} onClick={closeMenu}>Home</MobileNavLink>
              <MobileNavLink to="/places" active={isActive('/places')} onClick={closeMenu}>Places</MobileNavLink>
              <MobileNavLink to="/tours" active={isActive('/tours')} onClick={closeMenu}>Tours</MobileNavLink>
              <MobileNavLink to="/about" active={isActive('/about')} onClick={closeMenu}>About</MobileNavLink>
            </div>
            
            {/* Mobile Authentication */}
            <div className="mt-4 pt-4 border-t border-white border-opacity-20 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <span className="font-poppins text-white mb-2">
                    Hi, {user?.name || user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    fullWidth
                    className="text-white border-white hover:bg-white hover:bg-opacity-10"
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
                      className="text-white border-white hover:bg-white hover:bg-opacity-10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button variant="accent" fullWidth>
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
    className={`font-poppins text-white transition-colors hover:text-white/80 ${
      active ? 'font-semibold border-b-2 border-white' : ''
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, active, onClick, children }) => (
  <Link
    to={to}
    className={`font-poppins py-2 text-white transition-colors hover:text-white/80 ${
      active ? 'font-semibold' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;