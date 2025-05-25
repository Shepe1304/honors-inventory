namespace HonorsInventory.API.Models.DTOs;

public class EquipmentDto
{
  public int Id { get; set; }
  public string Model { get; set; } = string.Empty;
  public string EquipmentType { get; set; } = string.Empty;
  public int LocationId { get; set; }
  public string LocationName { get; set; } = string.Empty;
  public string BuildingType { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}