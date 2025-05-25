using HonorsInventory.API.Data;
using HonorsInventory.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HonorsInventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
  private readonly InventoryContext _context;

  public LocationsController(InventoryContext context)
  {
    _context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Location>>> GetAllLocations()
  {
    var locations = await _context.Locations
        .OrderBy(l => l.BuildingType)
        .ThenBy(l => l.RoomName)
        .ToListAsync();

    return Ok(locations);
  }
}