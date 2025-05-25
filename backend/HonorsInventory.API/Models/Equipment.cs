using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HonorsInventory.API.Models;

public class Equipment
{
  public int Id { get; set; }

  [Required]
  [MaxLength(100)]
  public string Model { get; set; } = string.Empty;

  [Required]
  [MaxLength(50)]
  public string EquipmentType { get; set; } = string.Empty;

  public int LocationId { get; set; }

  [ForeignKey("LocationId")]
  public Location Location { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}