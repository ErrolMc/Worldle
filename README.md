# Wordle Clone

A modern implementation of the popular word-guessing game Wordle, built with a .NET 10 backend and React/Electron frontend.

**Live:** https://worldle-nu.vercel.app

## Deployment

- **Frontend** is deployed to [Vercel](https://vercel.com) automatically on push to `main` via Vercel's GitHub integration.
- **Backend** is deployed to [Azure App Service](https://azure.microsoft.com/en-us/products/app-service) via GitHub Actions. The workflow is defined in `.github/workflows/deploy-backend.yml` and triggers on pushes to `main` that modify `WordleServer/`.

## Architecture Overview

### Backend (.NET 10)
- **Framework**: ASP.NET Core Web API
- **Database**: Azure Cosmos DB
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI (development only)

### Frontend (React + Electron)
- **Framework**: React with TypeScript
- **Desktop App**: Electron
- **Build Tool**: Vite
- **Web Deployment**: Vercel

## API Endpoints

### Authentication (`api/auth`)
- **POST /register** - Register a new user
- **POST /login** - Authenticate and receive JWT + refresh token
- **POST /refresh** - Rotate refresh token and issue a new JWT (requires authorization)

### Game (`api/game`)
- **GET /wotd** - Get the word of the day
- **POST /report** - Report a game result
- **GET /has-played** - Check if a user has played today
- **GET /game-history** - Get a user's game history

## Development Setup

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- Azure Cosmos DB account (or Azure Cosmos DB Emulator for local development)

### Environment Variables (Backend)
| Variable | Description |
|---|---|
| `COSMOS_CONNECTION_STRING` | Azure Cosmos DB connection string |
| `COSMOS_DATABASE_NAME` | Cosmos DB database name |
| `JWT_SIGNING_KEY` | Secret key for signing JWTs |
| `API_URI` | Backend API URI (JWT issuer) |
| `WEB_APP_URI` | Frontend URL (for CORS and JWT audience) |

### Backend
```bash
cd WordleServer
dotnet restore
dotnet run
```

### Frontend
```bash
cd wordleclient
npm install
npm run dev
```

### Building Desktop App
- Windows: `npm run build:win`
- macOS: `npm run build:mac`
- Linux: `npm run build:linux`
