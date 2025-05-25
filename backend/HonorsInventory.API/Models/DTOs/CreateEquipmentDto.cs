using System.ComponentModel.DataAnnotations;

namespace HonorsInventory.API.Models.DTOs;

public class CreateEquipmentDto
{
  [Required]
  [MaxLength(100)]
  public string Model { get; set; } = string.Empty;

  [Required]
  [MaxLength(50)]
  public string EquipmentType { get; set; } = string.Empty;

  public int? LocationId { get; set; } // Optional - defaults to warehouse
}