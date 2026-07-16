# Prisma Migration Guide

## Overview
This document outlines the migration from `pg` to Prisma ORM for the AI Career Guidance Platform backend.

## Files Created

### 1. **prisma/schema.prisma**
- **Purpose**: Core Prisma configuration file
- **Contains**:
  - Generator configuration for Prisma Client
  - PostgreSQL data source configuration
  - Environment variable reference for DATABASE_URL
  - Ready for model definitions (User, Career, Assessment, etc.)

### 2. **src/lib/prisma.ts**
- **Purpose**: Singleton PrismaClient instance for database operations
- **Key Features**:
  - Prevents multiple PrismaClient instances in development (hot-reload safe)
  - Global instance caching using `globalForPrisma`
  - Logging configuration: queries, errors, and warnings
  - Production-ready pattern
  - Default export for easy importing

**Pattern Explanation**:
```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

This ensures that during development with tsx watch, the same Prisma Client instance is reused, preventing connection pool exhaustion.

### 3. **.env.example**
- **Purpose**: Template for environment variables
- **Content**: Shows required variables without sensitive values
- **Usage**: Copy to `.env` and fill in actual values

### 4. **.gitignore**
- **Purpose**: Prevent committing sensitive files
- **Includes**: .env files, node_modules, build outputs, IDE configs, logs

## Files Modified

### 1. **src/server.ts**
**Changes**:
- ❌ **Removed**: `import pool from "./config/database.js";`
- ✅ **Added**: `import prisma from "./lib/prisma.js";`
- ❌ **Removed**: `await pool.query("SELECT NOW()");` (pg-specific)
- ✅ **Added**: `await prisma.$queryRaw\`SELECT NOW();\`` (Prisma equivalent)
- Updated console messages for clarity

**Why**: Prisma replaces the pg pool with a managed connection pool and provides ORM functionality.

### 2. **.env**
**Changes**:
- ✅ **Added**: `NODE_ENV=development` (used by Prisma client singleton)
- Format unchanged for DATABASE_URL (Neon PostgreSQL)

**Why**: NODE_ENV allows the Prisma client to behave differently in production vs. development.

## Files Deleted

### 1. **src/config/database.ts**
- **Reason**: Replaced by Prisma configuration
- **Why**: `src/lib/prisma.ts` is the single source of truth for database connections

## Folder Structure After Migration

```
server/
├── prisma/
│   └── schema.prisma              ← Prisma schema (models defined here)
├── src/
│   ├── lib/
│   │   └── prisma.ts              ← Singleton PrismaClient
│   ├── config/                    ← Other configs (auth, etc.)
│   ├── controllers/               ← Request handlers
│   ├── middleware/                ← Express middleware
│   ├── routes/                    ← API routes
│   ├── services/                  ← Business logic (using Prisma)
│   ├── utils/                     ← Utilities
│   ├── app.ts                     ← Express app
│   └── server.ts                  ← Server entry point
├── .env                           ← Environment variables (NEVER commit)
├── .env.example                   ← Template for .env
├── .gitignore                     ← Git ignore rules
└── package.json
```

## Database Connection Flow

### Before (pg):
```
server.ts → pool.query() → raw SQL → PostgreSQL
```

### After (Prisma):
```
server.ts → prisma.$queryRaw or prisma.model.operation() → PostgreSQL
```

## Next Steps

1. Run the terminal commands below to install dependencies
2. Generate Prisma Client with `npx prisma generate`
3. Push schema to database (if needed): `npx prisma db push`
4. Create models in `prisma/schema.prisma` as needed
5. Use `import prisma from "./lib/prisma.js"` in any service/controller

## Usage Example

In any service or controller file:

```typescript
import prisma from "../lib/prisma.js";

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
```

## Benefits of Prisma

✅ **Type-Safe**: Full TypeScript support with auto-generated types  
✅ **Developer Experience**: Auto-completion and error checking  
✅ **Query Optimization**: Prisma optimizes queries automatically  
✅ **Migrations**: Schema versioning and migration tracking  
✅ **Introspection**: Reverse-engineer existing databases  
✅ **Studio**: Visual database explorer (npx prisma studio)  
✅ **Performance**: Built-in connection pooling  

## No Breaking Changes

- ✅ Frontend code remains unchanged
- ✅ Express app structure preserved
- ✅ API routes compatible
- ✅ TypeScript configuration unchanged
