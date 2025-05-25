-- Honors Inventory Management System Database Schema
-- Created for USF Honors College IT Team

-- Create database if it doesn't exist
IF DB_ID('HonorsInventoryDb') IS NULL
    CREATE DATABASE HonorsInventoryDb;
GO

-- Switch to that database
USE HonorsInventoryDb;
GO

-- Drop existing tables if they exist (for fresh setup)
IF OBJECT_ID('Equipment', 'U') IS NOT NULL DROP TABLE Equipment;
IF OBJECT_ID('Locations', 'U') IS NOT NULL DROP TABLE Locations;
GO

-- Create Locations table
CREATE TABLE Locations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoomName NVARCHAR(100) NOT NULL UNIQUE,
    BuildingType NVARCHAR(20) NOT NULL CHECK (BuildingType IN ('Warehouse', 'Office', 'Classroom'))
);
GO

-- Create Equipment table
CREATE TABLE Equipment (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Model NVARCHAR(100) NOT NULL,
    EquipmentType NVARCHAR(50) NOT NULL,
    LocationId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (LocationId) REFERENCES Locations(Id) ON DELETE CASCADE
);
GO

-- Insert sample locations
INSERT INTO Locations (RoomName, BuildingType) VALUES 
('HON Warehouse', 'Warehouse'),
('HON 3017', 'Classroom'),
('HON 4015B', 'Office'),
('HON 2020', 'Classroom'),
('HON 4020A', 'Office'),
('HON 3025', 'Classroom');
GO

-- Insert sample equipment
INSERT INTO Equipment (Model, EquipmentType, LocationId) VALUES 
-- Classroom HON 3017 (Id: 2)
('HP LaserJet Pro', 'Printer', 2),
('Dell UltraSharp 24"', 'Monitor', 2),
('Logitech Wireless', 'Mouse', 2),

-- Office HON 4015B (Id: 3)
('Dell Elite8', 'Laptop', 3),
('HP EliteDisplay', 'Monitor', 3),
('Microsoft Ergonomic', 'Keyboard', 3),

-- Warehouse HON Warehouse (Id: 1)
('Dell UltraSharp 27"', 'Monitor', 1),
('Dell UltraSharp 24"', 'Monitor', 1),
('Dell UltraSharp 21"', 'Monitor', 1),
('Lenovo ThinkPad T14', 'Laptop', 1),
('HP Pavilion', 'Laptop', 1),
('Canon ImageRunner', 'Printer', 1),
('Logitech MX Master', 'Mouse', 1),
('Apple Magic', 'Mouse', 1),
('Corsair K95', 'Keyboard', 1),
('Microsoft Surface', 'Keyboard', 1),

-- Other locations
('MacBook Pro 16"', 'Laptop', 4),
('LG UltraWide', 'Monitor', 5),
('Brother HL-L2350DW', 'Printer', 6);
GO

-- Create indexes
CREATE INDEX IX_Equipment_LocationId ON Equipment(LocationId);
CREATE INDEX IX_Equipment_EquipmentType ON Equipment(EquipmentType);
CREATE INDEX IX_Equipment_Model ON Equipment(Model);
GO

-- Display inserted data
SELECT 
    e.Id,
    e.Model,
    e.EquipmentType,
    l.RoomName,
    l.BuildingType,
    e.CreatedAt
FROM Equipment e
INNER JOIN Locations l ON e.LocationId = l.Id
ORDER BY l.BuildingType, l.RoomName, e.EquipmentType;
