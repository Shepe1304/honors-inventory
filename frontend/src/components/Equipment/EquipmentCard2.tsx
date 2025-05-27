import { useDraggable } from "@dnd-kit/core";
import {
  Edit,
  Trash2,
  ArrowRight,
  Calendar,
  MapPin,
  GripVertical,
} from "lucide-react";
import type { Equipment } from "../../types";
import { toast } from "sonner";

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
}

export const EquipmentCard2: React.FC<EquipmentCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onTransfer,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: equipment.id,
  });

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white border border-gray-400 shadow-lg rounded-lg p-4 w-80 text-sm text-gray-800">
        <p className="mb-4">
          Are you sure you want to delete <strong>{equipment.model}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t)}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete();
              toast.dismiss(t);
              toast.success("Equipment deleted");
            }}
            className="text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div
      ref={setNodeRef}
      className={`card bg-white border border-gray-400 rounded-lg p-4 transition-all select-text ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1">
          <h4
            className="text-lg font-semibold text-gray-900 truncate"
            title={equipment.model}
          >
            {equipment.model}
          </h4>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {equipment.equipmentType}
          </span>
        </div>

        <div className="flex items-start space-x-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onTransfer}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Drag handle */}
          <button
            {...listeners}
            {...attributes}
            className="p-2 cursor-grab text-gray-400 hover:text-gray-600"
            style={{
              cursor: "grab",
            }}
            title="Drag"
          >
            <GripVertical className="h-4 w-4" />
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

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const CardPreview = ({ equipment }: { equipment: Equipment }) => (
  <div className="card bg-white border border-gray-400 rounded-lg p-4 transition-all select-text">
    <div className="flex justify-between items-start mb-4">
      <div className="min-w-0 flex-1">
        <h4
          className="text-lg font-semibold text-gray-900 truncate"
          title={equipment.model}
        >
          {equipment.model}
        </h4>
        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {equipment.equipmentType}
        </span>
      </div>

      <div className="flex items-start space-x-1">
        <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          className="p-2 cursor-grab text-gray-400 hover:text-gray-600"
          title="Drag"
        >
          <GripVertical className="h-4 w-4" />
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
