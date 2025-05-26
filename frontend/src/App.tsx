import React, { useState } from "react";
import { Header } from "./components/Layout/Header";
import { Sidebar } from "./components/Layout/Sidebar";
import { EquipmentList } from "./components/Equipment/EquipmentList";
import { AddEquipmentForm } from "./components/Equipment/AddEquipmentForm";
import { useEquipment } from "./hooks/useEquipment";
import { LoadingSpinner } from "./components/Common/LoadingSpinner";
import { EquipmentList2 } from "./components/Equipment/EquipmentList2";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-25">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6 ml-64">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* {currentView === "dashboard" && (
            <EquipmentList2
              equipment={equipment}
              locations={locations}
              onUpdate={updateEquipment}
              onDelete={deleteEquipment}
              onTransfer={transferEquipment}
            />
          )} */}
          {currentView === "dashboard" && (
            <EquipmentList
              equipment={equipment}
              locations={locations}
              onUpdate={updateEquipment}
              onDelete={deleteEquipment}
              onTransfer={transferEquipment}
            />
          )}

          {currentView === "add-equipment" && (
            <AddEquipmentForm
              locations={locations}
              onSubmit={handleAddEquipment}
              onCancel={() => setCurrentView("dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
