# URL Shortener

A backend service for shortening URLs, built with NestJS, TypeScript, and PostgreSQL.

## Tech Stack

- **Node.js** with TypeScript
- **NestJS** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Docker** - Containerization
- **Zod** - Input validation

## Architecture

The project follows **Domain-Driven Design (DDD)** principles with a clean architecture:

```
src/
├── api/                    # Presentation layer
│   ├── controllers/       # NestJS controllers
│   └── filters/           # Exception filters
├── application/           # Application layer
│   ├── use-cases/        # Business logic
│   ├── dtos/             # Data transfer objects
│   └── utils/            # Application utilities
├── domain/               # Domain layer
│   ├── entities/         # Domain entities
│   └── repositories/     # Repository interfaces
└── infrastructure/       # Infrastructure layer
    ├── database/         # Database configuration
    └── repositories/     # Repository implementations
```

## Quick Start

### Prerequisites

- Docker and Docker Compose

### Running the Project

```bash
# Clone the repository
git clone https://github.com/jean1591/url-short
cd url-short

# Copy environment variables
cp .env.example .env

# Start the application (builds, migrates DB, starts server)
docker-compose up --build
```

The API will be available at `http://localhost:3000`

## API Endpoints

### 1. Create Short URL

**POST** `/api/url`

Converts a long URL into a short URL.

**Request:**

```bash
curl -X POST http://localhost:3000/api/url \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://www.google.com"}'
```

**Response:**

```json
{
  "shortCode": "zYbzqi",
  "shortUrl": "http://localhost:3000/api/url/zYbzqi",
  "longUrl": "https://www.google.com"
}
```

### 2. Redirect to Original URL

**GET** `/api/url/:shortCode`

Redirects to the original long URL.

**Request:**

```bash
curl -L http://localhost:3000/api/url/zYbzqi
```

**Response:**

- HTTP 301 redirect to the original URL
- Or HTTP 404 if short code not found

**Browser:**
Simply visit `http://localhost:3000/api/url/zYbzqi` in your browser and you'll be redirected to the original URL.

## Development

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start PostgreSQL (adjust connection string in .env)
# DATABASE_URL=postgresql://user_api:Uj520^@localhost:5432/url_short

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm test                 # Run tests
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## Key Features

- **Clean Architecture**: Separation of concerns with DDD principles
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Zod schemas for request validation
- **Unique Short Codes**: Collision detection with retry mechanism
- **Error Handling**: Centralized error handling middleware
- **Docker Support**: One-command deployment
- **Auto Migrations**: Database schema applied automatically on startup

## Project Structure Details

### Domain Layer

- **Entities**: Pure business objects with no dependencies
- **Repository Interfaces**: Contracts for data access

### Application Layer

- **Use Cases**: Orchestrate business logic
- **DTOs**: Input/output data structures
- **Validators**: Zod schemas for validation

### Infrastructure Layer

- **Prisma**: Database access implementation
- **Repository Implementations**: Concrete implementations of domain interfaces

### API Layer

- **Controllers**: HTTP request/response handling with NestJS decorators
- **Filters**: Exception handling for error responses

## Notes

- Short codes are generated using base62 encoding (a-z, A-Z, 0-9)
- Default short code length: 6 characters
- Collision detection with max 10 retry attempts
- Uses HTTP 301 (permanent redirect) for SEO benefits
