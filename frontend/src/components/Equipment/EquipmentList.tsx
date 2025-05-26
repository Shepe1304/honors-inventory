// Uncomment all non-description lines for simple drag-and-drop functionality
// (Better drag-and-drop functionality is available at EquipmentList2.tsx & EquipmentCard2.tsx)

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

  const [targetBuildingType, setTargetBuildingType] = useState<string | null>(
    null
  );

  // For drag & drop between building types
  // const [draggedItem, setDraggedItem] = useState<number | null>(null);

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

  // Action handler: Edit equipment
  const handleEdit = async (data: UpdateEquipmentDto) => {
    if (!editingEquipment) return false;
    const success = await onUpdate(editingEquipment.id, data);
    if (success) {
      setEditingEquipment(null);
    }
    return success;
  };

  // Action handler: Transfer equipment
  const handleTransfer = async (data: TransferEquipmentDto) => {
    if (!transferringEquipment) return false;
    const success = await onTransfer(transferringEquipment.id, data);
    if (success) {
      setTransferringEquipment(null);
      setTargetBuildingType(null);
    }
    return success;
  };

  // Get filtered locations for transfer modal
  const getFilteredLocations = () => {
    if (!targetBuildingType) return locations;
    return locations.filter((loc) => loc.buildingType === targetBuildingType);
  };

  // Functions to preserve scroll and avoid page jumping to top
  const preserveScrollAndSetEdit = (item: Equipment) => {
    const scrollY = window.scrollY;
    setEditingEquipment(item);
    setTimeout(() => window.scrollTo(0, scrollY), 0);
  };

  const preserveScrollAndSetTransfer = (item: Equipment) => {
    const scrollY = window.scrollY;
    setTransferringEquipment(item);
    setTimeout(() => window.scrollTo(0, scrollY), 0);
  };

  // Function with drag & drop logic
  // const DropZone: React.FC<{
  //   buildingType: string;
  //   items: Equipment[];
  //   children: React.ReactNode;
  // }> = ({ buildingType, items, children }) => {
  //   const [isDragOver, setIsDragOver] = useState(false);

  //   const handleDragOver = (e: React.DragEvent) => {
  //     e.preventDefault();
  //     e.dataTransfer.dropEffect = "move";
  //     setIsDragOver(true);
  //   };

  //   const handleDragLeave = (e: React.DragEvent) => {
  //     e.preventDefault();
  //     setIsDragOver(false);
  //   };

  //   const handleDrop = async (e: React.DragEvent) => {
  //     e.preventDefault();
  //     setIsDragOver(false);

  //     try {
  //       const equipmentData = JSON.parse(
  //         e.dataTransfer.getData("application/json")
  //       );
  //       if (equipmentData.buildingType !== buildingType) {
  //         // Find the equipment object to show in the transfer modal
  //         const equipmentToTransfer = equipment.find(
  //           (item) => item.id === equipmentData.id
  //         );

  //         if (equipmentToTransfer) {
  //           setTargetBuildingType(buildingType);
  //           setTransferringEquipment(equipmentToTransfer);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error parsing dropped data:", error);
  //     }
  //   };

  //   return (
  //     <div
  //       className={`transition-all duration-200 rounded-lg ${
  //         isDragOver
  //           ? "bg-blue-50 border-2 border-dashed border-blue-400 shadow-lg"
  //           : "border-2 border-transparent"
  //       }`}
  //       onDragOver={handleDragOver}
  //       onDragLeave={handleDragLeave}
  //       onDrop={handleDrop}
  //     >
  //       {children}
  //       {isDragOver && items.length === 0 && (
  //         <div className="text-center py-8 text-blue-600">
  //           <Package className="mx-auto h-8 w-8 mb-2" />
  //           <p className="text-sm font-medium">Drop equipment here</p>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

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
          {/* <p className="text-sm text-usf-green mt-1">
            💡 Drag equipment cards between sections to transfer them
          </p> */}
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
            <Search
              className="absolute left-3 text-gray-400 h-5 w-5"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search equipment by model, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 focus:border-usf-green"
            />
          </div>

          {/* Equipment Type Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 text-gray-400 h-4 w-4"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none bg-white focus:border-usf-green"
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
              className="input-field appearance-none bg-white focus:border-usf-green"
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
            const items = groupedEquipment[buildingType] || [];

            return (
              <div key={buildingType}>
                {/* <DropZone
                key={buildingType}
                buildingType={buildingType}
                items={items}
              > */}
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

                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <EquipmentCard
                          key={item.id}
                          equipment={item}
                          onEdit={() => preserveScrollAndSetEdit(item)}
                          onTransfer={() => preserveScrollAndSetTransfer(item)}
                          onDelete={() => onDelete(item.id)}
                          // isDragging={draggedItem === item.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <Package className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm">No equipment in this location</p>
                      {/* <p className="text-xs text-gray-400 mt-1">
                        Drag items here to move them
                      </p> */}
                    </div>
                  )}
                </div>
                {/* </DropZone> */}
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
          locations={getFilteredLocations()}
          onTransfer={handleTransfer}
          onClose={() => {
            setTransferringEquipment(null);
            setTargetBuildingType(null);
          }}
        />
      )}
    </div>
  );
};
