using System.ComponentModel.DataAnnotations;

namespace HonorsInventory.API.Models.DTOs;

public class TransferEquipmentDto
{
  [Required]
  public int NewLocationId { get; set; }
}