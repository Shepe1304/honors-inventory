using HonorsInventory.API.Models.DTOs;
using HonorsInventory.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace HonorsInventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
  private readonly IEquipmentService _equipmentService;

  public EquipmentController(IEquipmentService equipmentService)
  {
    _equipmentService = equipmentService;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<EquipmentDto>>> GetAllEquipment()
  {
    var equipment = await _equipmentService.GetAllEquipmentAsync();
    return Ok(equipment);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<EquipmentDto>> GetEquipment(int id)
  {
    var equipment = await _equipmentService.GetEquipmentByIdAsync(id);
    if (equipment == null)
      return NotFound($"Equipment with ID {id} not found");

    return Ok(equipment);
  }

  [HttpPost]
  public async Task<ActionResult<EquipmentDto>> CreateEquipment(CreateEquipmentDto createDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    try
    {
      var equipment = await _equipmentService.CreateEquipmentAsync(createDto);
      return CreatedAtAction(nameof(GetEquipment), new { id = equipment.Id }, equipment);
    }
    catch (InvalidOperationException ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpPut("{id}")]
  public async Task<ActionResult<EquipmentDto>> UpdateEquipment(int id, UpdateEquipmentDto updateDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var equipment = await _equipmentService.UpdateEquipmentAsync(id, updateDto);
    if (equipment == null)
      return NotFound($"Equipment with ID {id} not found");

    return Ok(equipment);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteEquipment(int id)
  {
    var deleted = await _equipmentService.DeleteEquipmentAsync(id);
    if (!deleted)
      return NotFound($"Equipment with ID {id} not found");

    return NoContent();
  }

  [HttpPut("{id}/transfer")]
  public async Task<ActionResult<EquipmentDto>> TransferEquipment(int id, TransferEquipmentDto transferDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var equipment = await _equipmentService.TransferEquipmentAsync(id, transferDto);
    if (equipment == null)
      return NotFound($"Equipment with ID {id} or new location not found");

    return Ok(equipment);
  }
}