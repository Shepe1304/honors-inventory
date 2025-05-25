# Honors Inventory Management System

A full-stack inventory management application built for the University of South Florida Honors College IT Team. This system allows tracking, managing, and transferring IT equipment across different locations within the building.

## Tech Stack

**Frontend:**

- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)

**Backend:**

- ASP.NET Core 9.0
- Entity Framework Core
- SQL Server (can be configured for other databases)
- RESTful API architecture

**Database:**

- SQL Server (default)
- Entity Framework Code-First migrations

## Design

The application follows the University of South Florida's official branding:

- **Primary Green**: `#006747` (USF Green)
- **Secondary Gold**: `#FFD100` (USF Gold)
- Clean, academic layout with modern UI components
- Responsive design for desktop and mobile use

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js 18+** and **npm**

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version` and `npm --version`

- **.NET 9.0 SDK**

  - Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0)
  - Verify installation: `dotnet --version`

- **SQL Server** (one of the following):

  - SQL Server Express (free)
  - SQL Server Developer Edition (free)
  - SQL Server LocalDB (included with Visual Studio)
  - Azure SQL Database

- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)

## Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shepe1304/honors-inventory.git
cd honors-inventory
```

### Step 2: Database Setup

#### Option A: Using SQL Server Management Studio (SSMS)

1. Open SQL Server Management Studio
2. Connect to your SQL Server instance
   (e.g.,
   Server Type: Database Engine,
   Server Name: (localdb)\MSSQLLocalDB
   Authentication: Windows Authentication
   Encryption: Mandatory
   Click: Connect
   )
3. Open the file `database/schema.sql` or Create a new query then copy and paste the contents of `database/schema.sql`
4. Execute the script to create the database and sample data

#### Option B: Using Azure Data Studio

1. Open Azure Data Studio
2. Connect to your SQL Server instance
3. Create a new query
4. Copy and paste the contents of `database/schema.sql`
5. Execute the script

### Step 3: Backend Setup

```bash
# Navigate to the backend project folder
cd backend/HonorsInventory.API

# Restore NuGet packages
dotnet restore

# Build the project to check for errors
dotnet build
```

#### Configure Connection String (if needed)

If you're not using LocalDB, update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your-Connection-String-Here"
  }
}
```

Common connection string examples:

- **LocalDB**: `Server=(localdb)\\mssqllocaldb;Database=HonorsInventoryDb;Trusted_Connection=true;`
- **SQL Server Express**: `Server=.\\SQLEXPRESS;Database=HonorsInventoryDb;Trusted_Connection=true;`
- **Remote SQL Server**: `Server=your-server;Database=HonorsInventoryDb;User Id=your-username;Password=your-password;`

#### Run the Backend

```bash
# Start the API (from backend/HonorsInventory.API folder)
dotnet run
```

You should see output similar to:

```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
```

The API will be available at `https://localhost:5001` and Swagger documentation at `https://localhost:5001/swagger`

### Step 4: Frontend Setup

Open a **new terminal window** and navigate to the frontend folder:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see output similar to:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

The frontend will be available at `http://localhost:5173`

## Verification Steps

### 1. Check Database Connection

- Navigate to `https://localhost:5001/swagger`
- Try the `GET /api/locations` endpoint
- You should see the sample locations data

### 2. Check Frontend-Backend Communication

- Open `http://localhost:5173` in your browser
- You should see the Honors Inventory dashboard
- Equipment should be loaded and displayed

### 3. Test Basic Functionality

- Try adding new equipment
- Try editing existing equipment
- Try transferring equipment between locations
- Try searching and filtering

## Troubleshooting

### Common Issues and Solutions

## Project Structure Overview

```
honors-inventory/
├── README.md                          # This file
├── database/
│   └── schema.sql                     # Database creation script
├── backend/
│   └── HonorsInventory.API/           # ASP.NET Core API
│       ├── Controllers/               # API endpoints
│       ├── Models/                    # Data models and DTOs
│       ├── Data/                      # Entity Framework context
│       └── Services/                  # Business logic
└── frontend/
    ├── src/
    │   ├── components/                # React components
    │   ├── services/                  # API communication
    │   ├── hooks/                     # Custom React hooks
    │   └── types/                     # TypeScript definitions
    └── package.json                   # Frontend dependencies
```

## API Endpoints

Once running, these endpoints will be available:

### Equipment

- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment
- `PUT /api/equipment/{id}/transfer` - Transfer equipment to new location

### Locations

- `GET /api/locations` - Get all locations

## Features

- **Equipment Management**: Add, edit, delete, and view IT equipment
- **Location Tracking**: Track equipment across Warehouse, Office, and Classroom locations
- **Transfer System**: Move equipment between locations with audit trail
- **Search & Filter**: Find equipment by type, model, or location
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation for better development experience

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Getting Help

If you encounter issues:

1. **Check the console logs** in both terminal windows for error messages
2. **Verify all prerequisites** are installed and up to date
3. **Check database connectivity** using SQL Server Management Studio
4. **Clear browser cache** and restart both servers
5. **Check firewall settings** if you can't access the applications

---

Built with ❤️ for the USF Honors College IT Team
