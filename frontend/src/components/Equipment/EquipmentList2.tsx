import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useState } from "react";
import { Package, Search, Filter } from "lucide-react";
import type {
  Equipment,
  Location,
  TransferEquipmentDto,
  UpdateEquipmentDto,
} from "../../types";
import { EquipmentCard2 } from "./EquipmentCard2";
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

// Drop zone component for building types
const BuildingDropZone = ({
  buildingType,
  children,
  isActive,
}: {
  buildingType: string;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: buildingType,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-200 rounded-lg p-4 border-2 ${
        isOver
          ? "bg-blue-50 border-dashed border-blue-400 shadow-lg"
          : "border-transparent"
      }`}
    >
      {children}
      {isOver && (
        <div className="text-center py-4 text-blue-600">
          <Package className="mx-auto h-6 w-6 mb-2" />
          <p className="text-sm font-medium">Drop to transfer here</p>
        </div>
      )}
    </div>
  );
};

export const EquipmentList2 = ({
  equipment,
  locations,
  onTransfer,
  onUpdate,
  onDelete,
}: EquipmentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeEquipment, setActiveEquipment] = useState<Equipment | null>(
    null
  );

  // Transfer modal states
  const [transferringEquipment, setTransferringEquipment] =
    useState<Equipment | null>(null);
  const [targetBuildingType, setTargetBuildingType] = useState<string | null>(
    null
  );

  // Edit modal state
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );

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

  const handleDragStart = (event: any) => {
    const id = event.active.id;
    const item = equipment.find((e) => e.id === id);
    setActiveId(id);
    setActiveEquipment(item || null);
  };

  const handleDragEnd = (event: any) => {
    const { over, active } = event;

    if (over && active && activeEquipment) {
      const newBuildingType = over.id;

      // Only proceed if dropping into a different building type
      if (newBuildingType !== activeEquipment.buildingType) {
        // Set up transfer modal with target building type filter
        setTargetBuildingType(newBuildingType);
        setTransferringEquipment(activeEquipment);
      }
    }

    setActiveId(null);
    setActiveEquipment(null);
  };

  // Handle transfer with location selection
  const handleTransfer = async (data: TransferEquipmentDto) => {
    if (!transferringEquipment) return false;
    const success = await onTransfer(transferringEquipment.id, data);
    if (success) {
      setTransferringEquipment(null);
      setTargetBuildingType(null);
    }
    return success;
  };

  // Handle edit
  const handleEdit = async (data: UpdateEquipmentDto) => {
    if (!editingEquipment) return false;
    const success = await onUpdate(editingEquipment.id, data);
    if (success) {
      setEditingEquipment(null);
    }
    return success;
  };

  // Get filtered locations for transfer modal
  const getFilteredLocations = () => {
    if (!targetBuildingType) return locations;
    return locations.filter((loc) => loc.buildingType === targetBuildingType);
  };

  // Functions to preserve scroll
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

  const renderCard = (item: Equipment) => {
    return (
      <EquipmentCard2
        key={item.id}
        equipment={item}
        onEdit={() => preserveScrollAndSetEdit(item)}
        onTransfer={() => preserveScrollAndSetTransfer(item)}
        onDelete={() => onDelete(item.id)}
      />
    );
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
          <p className="text-sm text-usf-green mt-1">
            💡 Drag equipment cards between sections to transfer them
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredEquipment.length} of {equipment.length} items
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search equipment by model, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Equipment Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Locations</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Office">Office</option>
              <option value="Classroom">Classroom</option>
            </select>
          </div>
        </div>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Equipment Grouped Display */}
        {filteredEquipment.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
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
              const items = filteredEquipment.filter(
                (e) => e.buildingType === buildingType
              );

              return (
                <BuildingDropZone
                  key={buildingType}
                  buildingType={buildingType}
                  isActive={activeId !== null}
                >
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
                      {items.map((item) => renderCard(item))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <Package className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm">No equipment in this location</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Drag items here to move them
                      </p>
                    </div>
                  )}
                </BuildingDropZone>
              );
            })}
          </div>
        )}

        <DragOverlay>
          {activeEquipment && (
            <EquipmentCard2
              equipment={activeEquipment}
              onEdit={() => {}}
              onTransfer={() => {}}
              onDelete={() => {}}
            />
          )}
        </DragOverlay>
      </DndContext>

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
