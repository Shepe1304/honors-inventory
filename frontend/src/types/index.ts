// Types and Interfaces

export interface Equipment {
  id: number;
  model: string;
  equipmentType: string;
  locationId: number;
  locationName: string;
  buildingType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  roomName: string;
  buildingType: string;
}

export interface CreateEquipmentDto {
  model: string;
  equipmentType: string;
  locationId?: number;
}

export interface UpdateEquipmentDto {
  model: string;
  equipmentType: string;
}

export interface TransferEquipmentDto {
  newLocationId: number;
}

export type BuildingType = "Warehouse" | "Office" | "Classroom";
