import React from "react";
import logo from "../../assets/honors-logo.png";

export const Header: React.FC = () => {
  return (
    // not yet responsive, TODO: make responsive later.
    <header className="fixed w-screen bg-usf-green text-white shadow-lg z-100">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-15 w-15 bg-white rounded-full flex justify-center items-center">
            <img
              src={logo}
              alt="Honors College Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Honors Inventory</h1>
            <p className="text-usf-gold text-sm">
              University of South Florida - Honors College
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
