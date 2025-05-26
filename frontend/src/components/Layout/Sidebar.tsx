import React from "react";
import { Home, Plus, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/add", label: "Add Equipment", icon: Plus },
    { path: "/summary", label: "Summary Preview", icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 pt-25 h-full w-64 shadow-lg border-r border-gray-300 z-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;

            return (
              <li key={path}>
                <Link
                  to={path}
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
  );
};
