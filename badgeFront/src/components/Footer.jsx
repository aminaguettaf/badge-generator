import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dull rounded-lg flex items-center justify-center shadow-md">
              <img src={assets.logo} alt='logo'/>
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">© {currentYear}</span>
              <span className="mx-2 text-text-secondary">|</span>
              <span className="text-primary font-medium">Sonatrach - DP-HBK</span>
            </div>
          </div>
          <div className="text-sm text-text-secondary"> Tous droits réservés </div>
          {/* <div className="flex items-center space-x-4">
           
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;