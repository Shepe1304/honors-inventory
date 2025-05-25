import React from 'react';
import { Package } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    // not yet responsive, TODO: make responsive later.
    <header className="fixed w-screen bg-usf-green text-white shadow-lg z-100">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-usf-gold" />
          <div>
            <h1 className="text-2xl font-bold">Honors Inventory</h1>
            <p className="text-usf-gold text-sm">University of South Florida - Honors College</p>
          </div>
        </div>
      </div>
    </header>
  );
};