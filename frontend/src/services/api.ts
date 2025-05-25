// reusable API service layer. Designed to handle communication with backend API

import axios from "axios";
import type {
  Equipment,
  Location,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  TransferEquipmentDto,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const equipmentApi = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get("/equipment");
    return response.data;
  },

  getById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  create: async (equipment: CreateEquipmentDto): Promise<Equipment> => {
    const response = await api.post("/equipment", equipment);
    return response.data;
  },

  update: async (
    id: number,
    equipment: UpdateEquipmentDto
  ): Promise<Equipment> => {
    const response = await api.put(`/equipment/${id}`, equipment);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },

  transfer: async (
    id: number,
    transferData: TransferEquipmentDto
  ): Promise<Equipment> => {
    const response = await api.put(`/equipment/${id}/transfer`, transferData);
    return response.data;
  },
};

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get("/locations");
    return response.data;
  },
};

export default api;
