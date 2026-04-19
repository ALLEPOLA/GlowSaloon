# GlowVault Backend

A Node.js + TypeScript backend API for GlowVault with MySQL database integration.

## Setup

### Installation

Install dependencies:
```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with your MySQL credentials:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=salondb
```

**Configuration Details:**
- `DB_HOST` - MySQL server host (default: localhost)
- `DB_USER` - MySQL username (default: root)
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name (salondb)

### Development

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── db.ts             # MySQL database connection pool
│   └── queries.ts        # Database query functions
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables (create this)
├── .env.example          # Environment variables template
└── .gitignore            # Git ignore rules
```

## Available Endpoints

### General
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /db-health` - Database connection check

### Salons (Example endpoints with database integration)
- `GET /salons` - Get all salons
- `GET /salons/:id` - Get salon by ID
- `POST /salons` - Create new salon
  - Body: `{ name, email, phone }`
- `PUT /salons/:id` - Update salon
  - Body: `{ name, email, phone }`
- `DELETE /salons/:id` - Delete salon

## Database Connection

The backend uses `mysql2` with connection pooling for efficient database management:

- **Connection Limit:** 10 concurrent connections
- **Auto-reconnect:** Enabled
- **Query Support:** Supports prepared statements for security

### Testing Database Connection

```bash
curl http://localhost:3000/db-health
```

Expected response:
```json
{
  "status": "Database connected",
  "database": "salondb"
}
```

## Dependencies

- **express** - Web framework
- **mysql2** - MySQL client with async/await support
- **dotenv** - Environment variable management
- **typescript** - Type-safe JavaScript
- **ts-node** - TypeScript execution for development

## Database Requirements

Make sure your MySQL server has a database named `salondb` created:

```sql
CREATE DATABASE salondb;
```

For the example salon endpoints, create a `salons` table:

```sql
CREATE TABLE salons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `500` - Server Error

All errors include descriptive messages for debugging.
