import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const {user, logout, navigate} = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    {path: '/', label: 'Générer Badge'},
    {path: '/employes', label: 'Gestion des Employés'}
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center space-x-3 group cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
            <div className="relative">
              <div className={`w-12 h-12 bg-gradient-to-br from-primary to-primary-dull rounded-xl flex items-center justify-center transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-3' : ''} shadow-lg`}>
                <img src={assets.logo} alt='logo'/>
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-primary-dull rounded-xl transition-all duration-300 ${isHovered ? 'opacity-30 blur' : 'opacity-0'}`}></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dull bg-clip-text text-transparent">Badge Generator</span>
              <span className="text-xs tracking-wide text-text-secondary">Génération de badge simple & efficace</span>
            </div>
          </div>
          {user.is_staff && 
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={` relative font-medium px-3 py-2 text-lg transition-all duration-300 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-primary-dull before:transition-all before:duration-300 hover:before:w-full ${isActive(link.path) ? 'text-primary font-semibold before:w-full before:bg-primary' : 'text-text-primary hover:text-primary'}`} >
                  {link.label}
                </Link>
              ))}
            </div>
          }
          {user &&
            <button onClick={handleLogout} className="group relative px-8 py-3 rounded-xl text-white font-semibold text-lg flex items-center space-x-2 overflow-hidden transition-all duration-300 hover:shadow-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-primary-dull before:transition-transform before:duration-300 hover:before:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer">
              <span className="relative z-10">Déconnexion</span>
              <i className="fa-solid fa-arrow-right relative z-10 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"></i>
            </button>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;