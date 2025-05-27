import React from "react";
import logo from "../../assets/honors-logo.png";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-usf-green text-white shadow-lg z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="h-15 w-15 bg-white rounded-full flex justify-center items-center">
            <img
              src={logo}
              alt="Honors College Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Honors Inventory (Simplified)
            </h1>
            <p className="text-usf-gold text-sm hidden sm:block">
              University of South Florida - Honors College
            </p>
          </div>
        </div>

        {/* Hamburger for small screens */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};
