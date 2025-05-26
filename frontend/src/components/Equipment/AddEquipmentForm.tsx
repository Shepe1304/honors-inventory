import React from "react";
import { useFormik } from "formik";
import type { Location, CreateEquipmentDto } from "../../types";
import { Package, Plus } from "lucide-react";
import { Button } from "../Common/Button";

interface AddEquipmentFormProps {
  locations: Location[];
  onSubmit: (data: CreateEquipmentDto) => Promise<boolean>;
  onCancel: () => void;
}

// TODO: Put these in database for scalability -- I just need to pull them from database instead of hard-coding them
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
  // Default location set to Warehouse
  const warehouseLocation = locations.find(
    (l) => l.buildingType === "Warehouse"
  );

  // Using Formik because that's what I heard the Honors team uses
  const formik = useFormik<CreateEquipmentDto>({
    initialValues: {
      model: "",
      equipmentType: "",
      locationId: undefined,
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
      await onSubmit(values);
      setSubmitting(false);
    },
  });

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

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Equipment Model */}
          <div>
            <label htmlFor="model" className="label">
              Equipment Model *
            </label>
            <input
              id="model"
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
            <label htmlFor="equipmentType" className="label">
              Equipment Type *
            </label>
            <select
              id="equipmentType"
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

          {/* Location */}
          <div>
            <label htmlFor="locationId" className="label">
              Initial Location
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formik.values.locationId ?? ""}
              onChange={(e) =>
                formik.setFieldValue(
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
              {formik.values.locationId
                ? `Equipment will be added to ${
                    locations.find((l) => l.id === formik.values.locationId)
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
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={formik.isSubmitting}
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>{formik.isSubmitting ? "Adding..." : "Add Equipment"}</span>
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
