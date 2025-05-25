import React, { useState } from "react";
import { Header } from "./components/Layout/Header";
import { EquipmentList } from "./components/Equipment/EquipmentList";
import { useEquipment } from "./hooks/useEquipment";

type View = "dashboard" | "add-equipment";

function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const {
    equipment,
    locations,
    loading,
    error,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    transferEquipment,
  } = useEquipment();

  const handleAddEquipment = async (equipmentData: any) => {
    const success = await createEquipment(equipmentData);
    if (success) {
      setCurrentView("dashboard");
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {currentView === "dashboard" && (
            <EquipmentList
              equipment={equipment}
              locations={locations}
              onUpdate={updateEquipment}
              onDelete={deleteEquipment}
              onTransfer={transferEquipment}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
