// Interface defining equipment's logic methods.

using HonorsInventory.API.Models.DTOs;

namespace HonorsInventory.API.Services;

public interface IEquipmentService
{
  Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync();
  Task<EquipmentDto?> GetEquipmentByIdAsync(int id);
  Task<EquipmentDto> CreateEquipmentAsync(CreateEquipmentDto createDto);
  Task<EquipmentDto?> UpdateEquipmentAsync(int id, UpdateEquipmentDto updateDto);
  Task<bool> DeleteEquipmentAsync(int id);
  Task<EquipmentDto?> TransferEquipmentAsync(int id, TransferEquipmentDto transferDto);
}