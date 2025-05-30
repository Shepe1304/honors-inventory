// maps C# models to database tables

using HonorsInventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HonorsInventory.API.Data;

public class InventoryContext : DbContext
{
  public InventoryContext(DbContextOptions<InventoryContext> options) : base(options) { }

  public DbSet<Equipment> Equipment { get; set; }
  public DbSet<Location> Locations { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Configure Equipment entity
    modelBuilder.Entity<Equipment>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Model).IsRequired().HasMaxLength(100);
      entity.Property(e => e.EquipmentType).IsRequired().HasMaxLength(50);
      entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
      entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

      entity.HasOne(e => e.Location)
                .WithMany(l => l.Equipment)
                .HasForeignKey(e => e.LocationId)
                .OnDelete(DeleteBehavior.Cascade);
    });

    // Configure Location entity
    modelBuilder.Entity<Location>(entity =>
    {
      entity.HasKey(l => l.Id);
      entity.Property(l => l.RoomName).IsRequired().HasMaxLength(100);
      entity.Property(l => l.BuildingType).IsRequired().HasMaxLength(20);
      entity.HasIndex(l => l.RoomName).IsUnique();
    });
  }
}