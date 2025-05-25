import { useState } from "react";
import "./App.css";
import { Header } from "./components/Layout/Header";
import { EquipmentList } from "./components/Equipment/EquipmentList";
import { useEquipment } from "./hooks/useEquipment";

function App() {
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
  return (
    <div>
      <Header />
      <EquipmentList
        equipment={equipment}
        locations={locations}
        onUpdate={updateEquipment}
        onDelete={deleteEquipment}
        onTransfer={transferEquipment}
      />
    </div>
  );
}

export default App;
