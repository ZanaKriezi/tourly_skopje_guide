import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-text text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-montserrat text-xl font-bold">
              Skopje Tourism Guide
            </Link>
            <p className="font-inter text-sm mt-4 text-gray-300">
              Discover the beauty and rich cultural heritage of Skopje, 
              Macedonia's vibrant capital city.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-poppins text-lg font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              <FooterLink to="/places?type=HISTORICAL">Historical Sites</FooterLink>
              <FooterLink to="/places?type=MUSEUMS">Museums</FooterLink>
              <FooterLink to="/places?type=RESTAURANT">Restaurants</FooterLink>
              <FooterLink to="/places?type=CAFE_BAR">Cafés & Bars</FooterLink>
            </ul>
          </div>
          
          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-poppins text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/tours">Guided Tours</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>
          
          {/* Legal and Social */}
          <div className="col-span-1">
            <h3 className="font-poppins text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <SocialIcon href="https://facebook.com" icon="facebook" />
              <SocialIcon href="https://instagram.com" icon="instagram" />
              <SocialIcon href="https://twitter.com" icon="twitter" />
            </div>
            
            <h3 className="font-poppins text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Skopje Tourism Guide. All rights reserved.</p>
          <p className="mt-1">
            Developed with ❤️ by Class Team
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
  <li>
    <Link 
      to={to}
      className="font-inter text-sm text-gray-300 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
);

interface SocialIconProps {
  href: string;
  icon: 'facebook' | 'instagram' | 'twitter';
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return (
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        );
      case 'instagram':
        return (
          <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </>
        );
      case 'twitter':
        return (
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        );
      default:
        return null;
    }
  };

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-white transition-colors"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {getIcon()}
      </svg>
    </a>
  );
};

export default Footer;