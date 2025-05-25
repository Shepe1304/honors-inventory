import React from "react";
import type { Equipment } from "../../types";
import { Edit, Trash2, ArrowRight, Calendar, MapPin } from "lucide-react";

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${equipment.model}?`)) {
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 border border-1 border-gray-400 rounded-30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {equipment.model}
          </h4>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {equipment.equipmentType}
          </span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-usf-green hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit equipment"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onTransfer}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Transfer equipment"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Delete equipment"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{equipment.locationName}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Added {formatDate(equipment.createdAt)}</span>
        </div>
        {equipment.updatedAt !== equipment.createdAt && (
          <div className="text-xs text-gray-500">
            Updated {formatDate(equipment.updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
};
