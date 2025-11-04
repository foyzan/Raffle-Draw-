# Lottery Ticket Management API

A RESTful API service for managing lottery tickets, including ticket sales, updates, and random draw functionality. Built with Node.js and Express.

## Features

- 🎫 Single ticket sales with unique IDs
- 📦 Bulk ticket purchasing
- 🔍 Ticket lookup by ID or username
- ✏️ Update ticket information
- 🗑️ Delete single or multiple tickets
- 🎲 Random draw functionality with configurable winner count
- 🔄 Full CRUD operations for ticket management

## API Endpoints

### Ticket Management
- `GET /api/v1/ticket/t/:ticketId` - Get ticket by ID
- `PATCH /api/v1/ticket/t/:ticketId` - Update ticket by ID
- `DELETE /api/v1/ticket/t/:ticketId` - Delete ticket by ID

### User Operations
- `GET /api/v1/ticket/u/:username` - Get all tickets for a username
- `PATCH /api/v1/ticket/u/:username` - Update all tickets for a username
- `DELETE /api/v1/ticket/u/:username` - Delete all tickets for a username

### Sales and Draw
- `POST /api/v1/ticket/sell` - Purchase a single ticket
- `POST /api/v1/ticket/bulk` - Purchase multiple tickets at once
- `GET /api/v1/ticket/draw?wc={winnerCount}` - Conduct a random draw
- `GET /api/v1/ticket` - List all tickets

### System
- `GET /health` - Health check endpoint

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `default.env`:
   ```
   PORT = 8080
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Ticket Model

Each ticket contains:
- `id`: Unique identifier (auto-generated)
- `username`: Owner of the ticket
- `price`: Ticket price
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Development

Run tests:
```bash
node test.js
```

Start development server with auto-reload:
```bash
npm run dev
```

## Tech Stack

- Node.js
- Express
- Morgan (logging)
- CORS enabled
- dotenv for configuration

## Future Improvements

- Database persistence (currently in-memory)
- Request validation
- Authentication/Authorization
- Rate limiting
- API documentation (Swagger/OpenAPI)
- Structured logging
- CI/CD pipeline
- Container support# Raffle-Draw-
