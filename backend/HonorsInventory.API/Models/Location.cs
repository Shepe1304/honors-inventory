using System.ComponentModel.DataAnnotations;

namespace HonorsInventory.API.Models;

public class Location
{
  public int Id { get; set; }

  [Required]
  [MaxLength(100)]
  public string RoomName { get; set; } = string.Empty;

  [Required]
  [MaxLength(20)]
  public string BuildingType { get; set; } = string.Empty;

  public ICollection<Equipment> Equipment { get; set; } = new List<Equipment>();
}