// Uncomment all non-description lines for simple drag-and-drop functionality
// (Better drag-and-drop functionality is available at EquipmentList2.tsx & EquipmentCard2.tsx)

import React, { useRef } from "react";
import type { Equipment } from "../../types";
import {
  Edit,
  Trash2,
  ArrowRight,
  Calendar,
  MapPin,
  // GripVertical,
} from "lucide-react";
import { toast } from "sonner";

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
  // isDragging: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onTransfer,
  // isDragging,
}) => {
  const handleDelete = () => {
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

  // For dragging card
  // const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`card hover:shadow-md transition-all duration-200 border border-1 border-gray-400 rounded-30 select-text`}
      // ref={cardRef}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          {/* Adding truncate to avoid text overflow */}
          <h4
            className="text-lg font-semibold text-gray-900 mb-1 max-w-[200px] truncate"
            title={equipment.model}
          >
            {equipment.model}
          </h4>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {equipment.equipmentType}
          </span>
        </div>

        <div className="flex space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // e.stopPropagation(); // to avoid conflict on drag & drop
              onEdit();
            }}
            className="p-2 text-gray-500 hover:text-usf-green hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit equipment"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // e.stopPropagation(); // to avoid conflict on drag & drop
              onTransfer();
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Transfer equipment"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // e.stopPropagation(); // to avoid conflict on drag & drop
              handleDelete();
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Delete equipment"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Drag handle */}
          {/* <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify(equipment)
              );
              e.dataTransfer.effectAllowed = "move";

              if (cardRef.current) {
                e.dataTransfer.setDragImage(cardRef.current, 0, 0);
              }
            }}
            title="Drag to transfer"
            className="cursor-grab p-2 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="w-4 h-4" />
          </div> */}
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
