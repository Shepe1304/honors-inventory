using System.ComponentModel.DataAnnotations;

namespace HonorsInventory.API.Models.DTOs;

public class UpdateEquipmentDto
{
  [Required]
  [MaxLength(100)]
  public string Model { get; set; } = string.Empty;

  [Required]
  [MaxLength(50)]
  public string EquipmentType { get; set; } = string.Empty;

  [Required]
  public int NewLocationId { get; set; }
}