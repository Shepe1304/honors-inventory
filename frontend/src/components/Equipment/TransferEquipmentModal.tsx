// Rule of thumb: Form because there are free-form input, custom fields, etc.
// Rule of thumb: Modal if there's only dropdown selection involved

import React, { useState } from "react";
import type { Equipment, Location, TransferEquipmentDto } from "../../types";
import { ArrowRight, MapPin } from "lucide-react";
import { Modal } from "../Common/Modal";
import { Button } from "../Common/Button";
import { toast } from "sonner";

interface TransferEquipmentModalProps {
  equipment: Equipment;
  locations: Location[];
  onTransfer: (data: TransferEquipmentDto) => Promise<boolean>;
  onClose: () => void;
}

export const TransferEquipmentModal: React.FC<TransferEquipmentModalProps> = ({
  equipment,
  locations,
  onTransfer,
  onClose,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out current location
  const availableLocations = locations.filter(
    (loc) => loc.id !== equipment.locationId
  );
  const selectedLocation = locations.find(
    (loc) => loc.id === selectedLocationId
  );

  const handleTransfer = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // prevent scrolling to top
    }
    if (!selectedLocationId) return;

    setIsSubmitting(true);
    try {
      const success = await onTransfer({ newLocationId: selectedLocationId });
      if (success) {
        toast.success(
          `Equipment transferred to ${selectedLocation?.roomName} (${selectedLocation?.buildingType})`
        );
        onClose();
      } else {
        toast.error("Failed to transfer equipment");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBuildingTypeColor = (buildingType: string) => {
    switch (buildingType) {
      case "Warehouse":
        return "bg-blue-100 text-blue-800";
      case "Office":
        return "bg-green-100 text-green-800";
      case "Classroom":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Transfer Equipment">
      <form onSubmit={handleTransfer} className="space-y-6">
        {/* Equipment Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900">{equipment.model}</h4>
          <p className="text-sm text-gray-600">{equipment.equipmentType}</p>
        </div>

        {/* Current Location */}
        <div className="flex items-center justify-center space-x-4 py-4">
          <div className="text-center">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                Current Location
              </span>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-3">
              <div className="font-medium text-gray-900">
                {equipment.locationName}
              </div>
              <span
                className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${getBuildingTypeColor(
                  equipment.buildingType
                )}`}
              >
                {equipment.buildingType}
              </span>
            </div>
          </div>

          <ArrowRight className="h-6 w-6 text-gray-400" />

          <div className="text-center">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                New Location
              </span>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-3 ${
                selectedLocation
                  ? "bg-usf-green border-usf-green"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              {selectedLocation ? (
                <>
                  <div
                    className={`font-medium ${
                      selectedLocation ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedLocation.roomName}
                  </div>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${getBuildingTypeColor(
                      selectedLocation.buildingType
                    )}`}
                  >
                    {selectedLocation.buildingType}
                  </span>
                </>
              ) : (
                <div className="text-gray-500 text-sm">Select destination</div>
              )}
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <label className="label">Select New Location</label>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {availableLocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                <p className="text-sm">
                  No available locations in this building type
                </p>
              </div>
            ) : (
              availableLocations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedLocationId(location.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 ${
                    selectedLocationId === location.id
                      ? "border-usf-green bg-usf-green bg-opacity-5"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {location.roomName}
                      </div>
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${getBuildingTypeColor(
                          location.buildingType
                        )}`}
                      >
                        {location.buildingType}
                      </span>
                    </div>
                    {selectedLocationId === location.id && (
                      <div className="w-5 h-5 bg-usf-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              !selectedLocationId ||
              isSubmitting ||
              availableLocations.length === 0
            }
            className="flex items-center space-x-2"
          >
            <ArrowRight className="h-4 w-4" />
            <span>
              {isSubmitting ? "Transferring..." : "Transfer Equipment"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
