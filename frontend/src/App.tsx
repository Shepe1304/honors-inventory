import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Layout/Header";
import { Sidebar } from "./components/Layout/Sidebar";
import { EquipmentList } from "./components/Equipment/EquipmentList";
import { AddEquipmentForm } from "./components/Equipment/AddEquipmentForm";
import { useEquipment } from "./hooks/useEquipment";
import { LoadingSpinner } from "./components/Common/LoadingSpinner";
import { EquipmentList2 } from "./components/Equipment/EquipmentList2";
import { SummaryPreview } from "./components/Reports/SummaryPreview";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-col md:flex-row pt-25">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 md:p-6 md:ml-64">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Routes>
              <Route
                path="/"
                element={
                  <EquipmentList2
                    equipment={equipment}
                    locations={locations}
                    onUpdate={updateEquipment}
                    onDelete={deleteEquipment}
                    onTransfer={transferEquipment}
                  />
                }
              />
              {/* <Route
                path="/"
                element={
                  <EquipmentList
                    equipment={equipment}
                    locations={locations}
                    onUpdate={updateEquipment}
                    onDelete={deleteEquipment}
                    onTransfer={transferEquipment}
                  />
                }
              /> */}
              <Route
                path="/add"
                element={
                  <AddEquipmentForm
                    locations={locations}
                    onSubmit={handleAddEquipment}
                    onCancel={() => window.history.back()}
                  />
                }
              />
              <Route
                path="/summary"
                element={<SummaryPreview equipment={equipment} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
