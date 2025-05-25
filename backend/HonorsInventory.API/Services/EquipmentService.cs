using HonorsInventory.API.Data;
using HonorsInventory.API.Models;
using HonorsInventory.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HonorsInventory.API.Services;

public class EquipmentService : IEquipmentService
{
  private readonly InventoryContext _context;

  public EquipmentService(InventoryContext context)
  {
    _context = context;
  }

  public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync()
  {
    return await _context.Equipment
        .Include(e => e.Location)
        .Select(e => new EquipmentDto
        {
          Id = e.Id,
          Model = e.Model,
          EquipmentType = e.EquipmentType,
          LocationId = e.LocationId,
          LocationName = e.Location.RoomName,
          BuildingType = e.Location.BuildingType,
          CreatedAt = e.CreatedAt,
          UpdatedAt = e.UpdatedAt
        })
        .OrderBy(e => e.BuildingType)
        .ThenBy(e => e.LocationName)
        .ThenBy(e => e.EquipmentType)
        .ToListAsync();
  }

  public async Task<EquipmentDto?> GetEquipmentByIdAsync(int id)
  {
    return await _context.Equipment
        .Include(e => e.Location)
        .Where(e => e.Id == id)
        .Select(e => new EquipmentDto
        {
          Id = e.Id,
          Model = e.Model,
          EquipmentType = e.EquipmentType,
          LocationId = e.LocationId,
          LocationName = e.Location.RoomName,
          BuildingType = e.Location.BuildingType,
          CreatedAt = e.CreatedAt,
          UpdatedAt = e.UpdatedAt
        })
        .FirstOrDefaultAsync();
  }

  public async Task<EquipmentDto> CreateEquipmentAsync(CreateEquipmentDto createDto)
  {
    // Default to warehouse if no location is specified
    var locationId = createDto.LocationId;
    if (locationId == null)
    {
      var warehouse = await _context.Locations
          .FirstOrDefaultAsync(l => l.BuildingType == "Warehouse");
      locationId = warehouse?.Id ?? throw new InvalidOperationException("No warehouse location found");
    }

    var equipment = new Equipment
    {
      Model = createDto.Model,
      EquipmentType = createDto.EquipmentType,
      LocationId = locationId.Value,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    _context.Equipment.Add(equipment);
    await _context.SaveChangesAsync();

    return await GetEquipmentByIdAsync(equipment.Id)
        ?? throw new InvalidOperationException("Failed to retrieve created equipment");
  }

  public async Task<EquipmentDto?> UpdateEquipmentAsync(int id, UpdateEquipmentDto updateDto)
  {
    var equipment = await _context.Equipment.FindAsync(id);
    if (equipment == null) return null;

    equipment.Model = updateDto.Model;
    equipment.EquipmentType = updateDto.EquipmentType;
    equipment.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return await GetEquipmentByIdAsync(id);
  }

  public async Task<bool> DeleteEquipmentAsync(int id)
  {
    var equipment = await _context.Equipment.FindAsync(id);
    if (equipment == null) return false;

    _context.Equipment.Remove(equipment);
    await _context.SaveChangesAsync();
    return true;
  }

  public async Task<EquipmentDto?> TransferEquipmentAsync(int id, TransferEquipmentDto transferDto)
  {
    var equipment = await _context.Equipment.FindAsync(id);
    if (equipment == null) return null;

    // Verify new location exists
    var locationExists = await _context.Locations
        .AnyAsync(l => l.Id == transferDto.NewLocationId);
    if (!locationExists) return null;

    equipment.LocationId = transferDto.NewLocationId;
    equipment.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return await GetEquipmentByIdAsync(id);
  }
}