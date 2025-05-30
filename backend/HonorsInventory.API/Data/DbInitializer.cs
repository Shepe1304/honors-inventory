// Seeds database with tester data

using HonorsInventory.API.Models;

namespace HonorsInventory.API.Data;

public static class DbInitializer
{
  public static void Initialize(InventoryContext context)
  {
    context.Database.EnsureCreated();

    // Check if database has been seeded
    if (context.Locations.Any())
    {
      return; // Database has been seeded
    }

    // Seed locations
    var locations = new Location[]
    {
            new() { RoomName = "HON Warehouse", BuildingType = "Warehouse" },
            new() { RoomName = "HON 3017", BuildingType = "Classroom" },
            new() { RoomName = "HON 4015B", BuildingType = "Office" },
            new() { RoomName = "HON 2020", BuildingType = "Classroom" },
            new() { RoomName = "HON 4020A", BuildingType = "Office" },
            new() { RoomName = "HON 3025", BuildingType = "Classroom" }
    };

    context.Locations.AddRange(locations);
    context.SaveChanges();

    // Seed equipment
    var warehouse = context.Locations.First(l => l.BuildingType == "Warehouse");
    var classroom = context.Locations.First(l => l.RoomName == "HON 3017");
    var office = context.Locations.First(l => l.RoomName == "HON 4015B");

    var equipment = new Equipment[]
    {
            // Warehouse equipment
            new() { Model = "Dell UltraSharp 27\"", EquipmentType = "Monitor", LocationId = warehouse.Id },
            new() { Model = "Dell UltraSharp 24\"", EquipmentType = "Monitor", LocationId = warehouse.Id },
            new() { Model = "Lenovo ThinkPad T14", EquipmentType = "Laptop", LocationId = warehouse.Id },
            new() { Model = "Canon ImageRunner", EquipmentType = "Printer", LocationId = warehouse.Id },
            new() { Model = "Logitech MX Master", EquipmentType = "Mouse", LocationId = warehouse.Id },
            new() { Model = "Corsair K95", EquipmentType = "Keyboard", LocationId = warehouse.Id },
            
            // Classroom equipment
            new() { Model = "HP LaserJet Pro", EquipmentType = "Printer", LocationId = classroom.Id },
            new() { Model = "Dell UltraSharp 24\"", EquipmentType = "Monitor", LocationId = classroom.Id },
            new() { Model = "Logitech Wireless", EquipmentType = "Mouse", LocationId = classroom.Id },
            
            // Office equipment
            new() { Model = "Dell Elite8", EquipmentType = "Laptop", LocationId = office.Id },
            new() { Model = "HP EliteDisplay", EquipmentType = "Monitor", LocationId = office.Id },
            new() { Model = "Microsoft Ergonomic", EquipmentType = "Keyboard", LocationId = office.Id }
    };

    context.Equipment.AddRange(equipment);
    context.SaveChanges();
  }
}