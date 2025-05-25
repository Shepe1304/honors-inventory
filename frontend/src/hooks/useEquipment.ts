// custom hook that centralizes logic for fetching, creating, updating, and deleting items, as well as state management

import { useState, useEffect } from "react";
import type {
  Equipment,
  Location,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  TransferEquipmentDto,
} from "../types";
import { equipmentApi, locationsApi } from "../services/api";

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentApi.getAll();
      setEquipment(data);
    } catch (err) {
      setError("Failed to fetch equipment");
      console.error("Error fetching equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await locationsApi.getAll();
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const createEquipment = async (
    equipmentData: CreateEquipmentDto
  ): Promise<boolean> => {
    try {
      setError(null);
      const newEquipment = await equipmentApi.create(equipmentData);
      setEquipment((prev) => [...prev, newEquipment]);
      return true;
    } catch (err) {
      setError("Failed to create equipment");
      console.error("Error creating equipment:", err);
      return false;
    }
  };

  const updateEquipment = async (
    id: number,
    equipmentData: UpdateEquipmentDto
  ): Promise<boolean> => {
    try {
      setError(null);
      const updatedEquipment = await equipmentApi.update(id, equipmentData);
      setEquipment((prev) =>
        prev.map((item) => (item.id === id ? updatedEquipment : item))
      );
      return true;
    } catch (err) {
      setError("Failed to update equipment");
      console.error("Error updating equipment:", err);
      return false;
    }
  };

  const deleteEquipment = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await equipmentApi.delete(id);
      setEquipment((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete equipment");
      console.error("Error deleting equipment:", err);
      return false;
    }
  };

  const transferEquipment = async (
    id: number,
    transferData: TransferEquipmentDto
  ): Promise<boolean> => {
    try {
      setError(null);
      const updatedEquipment = await equipmentApi.transfer(id, transferData);
      setEquipment((prev) =>
        prev.map((item) => (item.id === id ? updatedEquipment : item))
      );
      return true;
    } catch (err) {
      setError("Failed to transfer equipment");
      console.error("Error transferring equipment:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchLocations();
  }, []);

  return {
    equipment,
    locations,
    loading,
    error,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    transferEquipment,
    refetch: fetchEquipment,
  };
};
