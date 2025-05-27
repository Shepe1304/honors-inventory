import React from "react";
import { Home, Plus, FileText, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/add", label: "Add Equipment", icon: Plus },
    { path: "/summary", label: "Summary Preview", icon: FileText },
  ];

  return (
    <>
      {isOpen ? (
        <div>
          {/* Overlay for mobile */}
          {isOpen && (
            <div
              className="fixed inset-0 z-40 md:hidden"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
              onClick={onClose}
            />
          )}

          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-300 z-50 transform transition-transform duration-200 md:translate-x-0 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } md:static md:block`}
          >
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-end p-4">
              <button onClick={onClose}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <nav className="p-4 pt-0 md:pt-25">
              <ul className="space-y-2">
                {menuItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;

                  return (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={onClose}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                          isActive
                            ? "bg-usf-green text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      ) : (
        <aside
          className={`hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-300 z-0 mt-5 transform transition-transform duration-200 md:translate-x-0 lg:block md:block`}
        >
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-end p-4">
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="p-4 pt-0 md:pt-25">
            <ul className="space-y-2">
              {menuItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;

                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={onClose}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        isActive
                          ? "bg-usf-green text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
    </>
  );
};
