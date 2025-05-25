import React from "react";
import { Home, Plus, Package, MapPin } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: "dashboard" | "add-equipment") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "add-equipment", label: "Add Equipment", icon: Plus },
  ];

  return (
    <aside className="fixed left-0 top-0 pt-25 h-full w-64 shadow-lg border-r border-gray-300 z-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() =>
                    onViewChange(item.id as "dashboard" | "add-equipment")
                  }
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "bg-usf-green text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
