import React from "react";
import type { Equipment } from "../../types";
import { Edit, Trash2, ArrowRight, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
  isDragging: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onTransfer,
  isDragging,
}) => {
  const handleDelete = () => {
    // if (window.confirm(`Are you sure you want to delete ${equipment.model}?`)) {
    //   onDelete();
    // }

    // toast(`Are you sure you want to delete "${equipment.model}"?`, {
    //   action: {
    //     label: "Delete",
    //     onClick: () => {
    //       onDelete();
    //       toast.success("Equipment deleted");
    //     },
    //   },
    // });

    toast.custom((t) => (
      <div className="bg-white border border-gray-400 shadow-lg rounded-lg p-4 w-80 text-sm text-gray-800">
        <p className="mb-4">
          Are you sure you want to delete <strong>{equipment.model}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete();
              toast.dismiss(t);
              toast.success("Equipment deleted");
            }}
            className="text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(equipment));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`card hover:shadow-md transition-all duration-200 border border-1 border-gray-400 rounded-30 cursor-move ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
    >
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-gray-500 hover:text-usf-green hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit equipment"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTransfer();
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Transfer equipment"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
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
