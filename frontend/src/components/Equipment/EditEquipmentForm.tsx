import React from "react";
import { useFormik } from "formik";
import type { Equipment, UpdateEquipmentDto } from "../../types";
import { Edit } from "lucide-react";
import { Button } from "../Common/Button";
import { toast } from "sonner";

interface EditEquipmentFormProps {
  equipment: Equipment;
  onSubmit: (data: UpdateEquipmentDto) => Promise<boolean>;
  onCancel: () => void;
}

// TODO: Can put all of these inside database instead
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
  const formik = useFormik<UpdateEquipmentDto>({
    initialValues: {
      model: equipment.model,
      equipmentType: equipment.equipmentType,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.model.trim()) {
        errors.model = "Model is required";
      } else if (values.model.length > 100) {
        errors.model = "Model name must be less than 100 characters";
      }

      if (!values.equipmentType) {
        errors.equipmentType = "Equipment type is required";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const success = await onSubmit(values);
        if (success) {
          toast.success("Equipment edited");
        } else {
          toast.error("Failed to edit equipment");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true, // in case the modal is reused with different `equipment`
  });

  const hasChanges =
    formik.values.model !== equipment.model ||
    formik.values.equipmentType !== equipment.equipmentType;

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

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Equipment Model */}
        <div>
          <label htmlFor="edit-model" className="label">
            Equipment Model *
          </label>
          <input
            id="edit-model"
            name="model"
            type="text"
            placeholder='e.g., Dell UltraSharp 24"'
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-field ${
              formik.touched.model && formik.errors.model
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            maxLength={100}
          />
          {formik.touched.model && formik.errors.model && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.model}</p>
          )}
        </div>

        {/* Equipment Type */}
        <div>
          <label htmlFor="edit-equipmentType" className="label">
            Equipment Type *
          </label>
          <select
            id="edit-equipmentType"
            name="equipmentType"
            value={formik.values.equipmentType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-field ${
              formik.touched.equipmentType && formik.errors.equipmentType
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
          >
            <option value="">Select equipment type...</option>
            {EQUIPMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {formik.touched.equipmentType && formik.errors.equipmentType && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.equipmentType}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={formik.isSubmitting || !hasChanges}
          >
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
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
