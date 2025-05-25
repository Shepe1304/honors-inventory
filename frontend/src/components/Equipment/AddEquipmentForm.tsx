import React, { useState } from "react";
import type { Location, CreateEquipmentDto } from "../../types";
import { Package, Plus } from "lucide-react";
import { Button } from "../Common/Button";

interface AddEquipmentFormProps {
  locations: Location[];
  onSubmit: (data: CreateEquipmentDto) => Promise<boolean>;
  onCancel: () => void;
}

const EQUIPMENT_TYPES = [
  "Laptop",
  "Monitor",
  "Printer",
  "Keyboard",
  "Mouse",
  "Desktop",
  "Tablet",
  "Projector",
  "Camera",
  "Speakers",
  "Headset",
  "Router",
  "Switch",
  "Cable",
  "Other",
];

export const AddEquipmentForm: React.FC<AddEquipmentFormProps> = ({
  locations,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateEquipmentDto>({
    model: "",
    equipmentType: "",
    locationId: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const warehouseLocation = locations.find(
    (l) => l.buildingType === "Warehouse"
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    } else if (formData.model.length > 100) {
      newErrors.model = "Model name must be less than 100 characters";
    }

    if (!formData.equipmentType) {
      newErrors.equipmentType = "Equipment type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateEquipmentDto,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-usf-green rounded-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Equipment
            </h2>
            <p className="text-gray-600">
              Add a new piece of equipment to the inventory
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Model */}
          <div>
            <label htmlFor="model" className="label">
              Equipment Model *
            </label>
            <input
              id="model"
              type="text"
              placeholder='e.g., Dell UltraSharp 24"'
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              className={`input-field ${
                errors.model ? "border-red-500 focus:ring-red-500" : ""
              }`}
              maxLength={100}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          {/* Equipment Type */}
          <div>
            <label htmlFor="equipmentType" className="label">
              Equipment Type *
            </label>
            <select
              id="equipmentType"
              value={formData.equipmentType}
              onChange={(e) =>
                handleInputChange("equipmentType", e.target.value)
              }
              className={`input-field ${
                errors.equipmentType ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="">Select equipment type...</option>
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.equipmentType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.equipmentType}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="label">
              Initial Location
            </label>
            <select
              id="location"
              value={formData.locationId || ""}
              onChange={(e) =>
                handleInputChange(
                  "locationId",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="input-field"
            >
              <option value="">Default to Warehouse</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.roomName} ({location.buildingType})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.locationId
                ? `Equipment will be added to ${
                    locations.find((l) => l.id === formData.locationId)
                      ?.roomName
                  }`
                : `Equipment will be added to ${
                    warehouseLocation?.roomName || "Warehouse"
                  } by default`}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>{isSubmitting ? "Adding..." : "Add Equipment"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Helper Info */}
      <div className="mt-6 card bg-gray-50">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Be specific with model names (e.g., "Dell UltraSharp U2415"
            instead of just "Dell Monitor")
          </li>
          <li>
            • Equipment added without a specific location will go to the
            warehouse by default
          </li>
          <li>
            • You can transfer equipment to different locations after adding it
          </li>
        </ul>
      </div>
    </div>
  );
};
