# Wordle Clone

A modern implementation of the popular word-guessing game Wordle, built with .NET 7 backend and React/Electron frontend.

## Architecture Overview

### Backend (.NET 7)
- **Framework**: ASP.NET Core Web API
- **Database**: Azure Cosmos DB
- **Authentication**: Basic authentication
- **API Documentation**: Swagger/OpenAPI
- **Key Features**:
  - RESTful API endpoints
  - User authentication and authorization
  - Game state management
  - Word validation and game logic
  - Score tracking and statistics

### Frontend (React + Electron)
- **Framework**: React with TypeScript
- **Desktop App**: Electron
- **Build Tool**: Vite
- **Key Features**:
  - Modern, responsive UI
  - Cross-platform desktop application
  - Real-time game state updates
  - Keyboard input support
  - Local storage for game progress
  - Auto-updates via electron-updater

## API Documentation

### Authentication
- **POST /api/auth/register**
  - Register a new user
  - Returns success response with user details

- **POST /api/auth/login**
  - Authenticate user
  - Returns success response with user details

### Game
- **GET /api/game/new**
  - Start a new game
  - Returns game ID and initial state

- **POST /api/game/{gameId}/guess**
  - Submit a word guess
  - Returns guess result and game state

- **GET /api/game/{gameId}**
  - Get current game state
  - Returns game details and progress

### User Stats
- **GET /api/stats**
  - Get user statistics
  - Returns win rate, average attempts, etc.

## Development Guide

### Prerequisites
- .NET 7 SDK
- Node.js 18+
- Azure Cosmos DB account (for backend)
- Visual Studio 2022 or VS Code (recommended)

### Backend Setup
1. Clone the repository
2. Navigate to `WordleServer` directory
3. Update `appsettings.json` with your Cosmos DB connection string
4. Run the following commands:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
5. Access Swagger UI at `https://localhost:7001/swagger`

### Frontend Setup
1. Navigate to `wordleclient` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

### Building Desktop App
- Windows: `npm run build:win`
- macOS: `npm run build:mac`
- Linux: `npm run build:linux`

### Development Workflow
1. Backend changes:
   - Make changes in `WordleServer` project
   - Update API documentation in Swagger
   - Test endpoints using Swagger UI

2. Frontend changes:
   - Modify React components in `src/renderer`
   - Update Electron main process in `src/main`
   - Test changes in development mode
   - Build and test desktop app