import { useState } from "react";
import type {
  Equipment,
  Location,
  TransferEquipmentDto,
  UpdateEquipmentDto,
} from "../../types";
import { Filter, Package, Search } from "lucide-react";
import { EquipmentCard } from "./EquipmentCard";
import { Modal } from "../Common/Modal";
import { EditEquipmentForm } from "./EditEquipmentForm";
import { TransferEquipmentModal } from "./TransferEquipmentModal";

interface EquipmentListProps {
  equipment: Equipment[];
  locations: Location[];
  onUpdate: (id: number, data: UpdateEquipmentDto) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onTransfer: (id: number, data: TransferEquipmentDto) => Promise<boolean>;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  equipment,
  locations,
  onUpdate,
  onDelete,
  onTransfer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [transferringEquipment, setTransferringEquipment] =
    useState<Equipment | null>(null);

  // Get unique equipment types for filtering
  const equipmentTypes = Array.from(
    new Set(equipment.map((item) => item.equipmentType))
  ).sort();

  // Filter equipment based on search and selected filters
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || item.equipmentType === filterType;
    const matchesLocation =
      filterLocation === "all" || item.buildingType === filterLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  // Group equipment by building type
  const groupedEquipment = filteredEquipment.reduce((groups, item) => {
    const key = item.buildingType;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, Equipment[]>);

  const handleEdit = async (data: UpdateEquipmentDto) => {
    if (!editingEquipment) return false;
    const success = await onUpdate(editingEquipment.id, data);
    if (success) {
      setEditingEquipment(null);
    }
    return success;
  };

  const handleTransfer = async (data: TransferEquipmentDto) => {
    if (!transferringEquipment) return false;
    const success = await onTransfer(transferringEquipment.id, data);
    if (success) {
      setTransferringEquipment(null);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Equipment Inventory
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track IT equipment across {locations.length} locations
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredEquipment.length} of {equipment.length} items
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search equipment by model, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Equipment Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none bg-white"
            >
              <option value="all">All Types</option>
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="input-field appearance-none bg-white"
            >
              <option value="all">All Locations</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Office">Office</option>
              <option value="Classroom">Classroom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grouped Display */}
      {Object.keys(groupedEquipment).length === 0 ? (
        <div className="card text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No equipment found
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== "all" || filterLocation !== "all"
              ? "Try adjusting your search or filters"
              : "Start by adding your first piece of equipment"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {["Warehouse", "Office", "Classroom"].map((buildingType) => {
            const items = groupedEquipment[buildingType];
            if (!items || items.length === 0) return null;

            return (
              <div key={buildingType}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        buildingType === "Warehouse"
                          ? "bg-blue-500"
                          : buildingType === "Office"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    />
                    {buildingType}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {items.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <EquipmentCard
                      key={item.id}
                      equipment={item}
                      onEdit={() => setEditingEquipment(item)}
                      onDelete={() => onDelete(item.id)}
                      onTransfer={() => setTransferringEquipment(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingEquipment && (
        <Modal
          isOpen={true}
          onClose={() => setEditingEquipment(null)}
          title="Edit Equipment"
        >
          <EditEquipmentForm
            equipment={editingEquipment}
            onSubmit={handleEdit}
            onCancel={() => setEditingEquipment(null)}
          />
        </Modal>
      )}

      {/* Transfer Modal */}
      {transferringEquipment && (
        <TransferEquipmentModal
          equipment={transferringEquipment}
          locations={locations}
          onTransfer={handleTransfer}
          onClose={() => setTransferringEquipment(null)}
        />
      )}
    </div>
  );
};
