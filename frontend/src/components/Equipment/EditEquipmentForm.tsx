// Rule of thumb: Form because there are free-form input, custom fields, etc.
// Rule of thumb: Modal if there's only dropdown selection involved

import React, { useState } from "react";
import type { Equipment, UpdateEquipmentDto } from "../../types";
import { Edit } from "lucide-react";
import { Button } from "../Common/Button";
import { toast } from "sonner";

interface EditEquipmentFormProps {
  equipment: Equipment;
  onSubmit: (data: UpdateEquipmentDto) => Promise<boolean>;
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

export const EditEquipmentForm: React.FC<EditEquipmentFormProps> = ({
  equipment,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UpdateEquipmentDto>({
    model: equipment.model,
    equipmentType: equipment.equipmentType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    e.stopPropagation(); // prevent scrolling back to top

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (!success) {
        // Form stays open if submission fails
        toast.error("Failed to edit equipment");
      } else {
        toast.success("Equipment edited");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateEquipmentDto,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const hasChanges =
    formData.model !== equipment.model ||
    formData.equipmentType !== equipment.equipmentType;

  return (
    <div className="w-full max-w-md" style={{ zIndex: "1000" }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-usf-green rounded-lg">
          <Edit className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Equipment
          </h3>
          <p className="text-sm text-gray-600">
            Currently in {equipment.locationName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Equipment Model */}
        <div>
          <label htmlFor="edit-model" className="label">
            Equipment Model *
          </label>
          <input
            id="edit-model"
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
          <label htmlFor="edit-equipmentType" className="label">
            Equipment Type *
          </label>
          <select
            id="edit-equipmentType"
            value={formData.equipmentType}
            onChange={(e) => handleInputChange("equipmentType", e.target.value)}
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
            <p className="mt-1 text-sm text-red-600">{errors.equipmentType}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
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
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {!hasChanges && (
        <p className="mt-3 text-sm text-gray-500 text-center">
          No changes detected
        </p>
      )}
    </div>
  );
};
