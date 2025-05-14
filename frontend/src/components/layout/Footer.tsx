// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                <MapPin size={20} />
              </div>
              <span className="font-display text-xl font-bold">Tourly</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Discover the beauty and rich cultural heritage of Skopje, 
              Macedonia's vibrant capital city.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display font-semibold text-lg mb-4">Discover</h3>
            <ul className="space-y-3">
              <FooterLink to="/places?type=HISTORICAL">Historical Sites</FooterLink>
              <FooterLink to="/places?type=MUSEUMS">Museums</FooterLink>
              <FooterLink to="/places?type=RESTAURANT">Restaurants</FooterLink>
              <FooterLink to="/places?type=CAFE_BAR">Cafés & Bars</FooterLink>
              <FooterLink to="/places?type=NATURE">Nature</FooterLink>
            </ul>
          </div>
          
          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-display font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/tours">Guided Tours</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-primary-400" />
                <span className="text-gray-400">Macedonia Square, 1000 Skopje, North Macedonia</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary-400" />
                <span className="text-gray-400">+389 2 3296 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary-400" />
                <span className="text-gray-400">info@tourly.mk</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Tourly. All rights reserved.</p>
          <p className="mt-1">
            Designed with ❤️ for travelers exploring Skopje
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
      className="text-gray-400 hover:text-primary-400 transition"
    >
      {children}
    </Link>
  </li>
);

export default Footer;