# Prisma Migration - Terminal Commands
# Execute these commands in order from the server directory

# Step 1: Navigate to server directory
cd "C:\Users\Ishan Pratap Singh\OneDrive\Desktop\Career AI\AI Career Guidance Platform\server"

# Step 2: Install Prisma and related dependencies
npm install @prisma/client
npm install -D prisma

# Step 3: Generate Prisma Client
# This creates the generated Prisma Client code
npx prisma generate

# Step 4: Verify DATABASE_URL connectivity
# Uncomment if needed: npx prisma db push --skip-generate

# Step 5: Test the migration by running the dev server
npm run dev

# Optional: View the database with Prisma Studio
# npx prisma studio

# ============================================
# SUMMARY OF CHANGES
# ============================================

# Files Created:
# ✅ prisma/schema.prisma
# ✅ src/lib/prisma.ts
# ✅ .env.example
# ✅ .gitignore
# ✅ PRISMA_MIGRATION.md

# Files Modified:
# ✅ src/server.ts (pg pool → Prisma)
# ✅ .env (added NODE_ENV)

# Files Deleted:
# ✅ src/config/database.ts (pg config)

# ============================================
# WHAT TO DO NEXT
# ============================================

# 1. Run the above commands in order
# 2. Check that "npm run dev" starts successfully
# 3. Open prisma/schema.prisma to define your models
# 4. Add models (User, Career, Assessment, etc.)
# 5. Run: npx prisma migrate dev --name init
# 6. Use Prisma in services: import prisma from "../lib/prisma.js"

# ============================================
# TROUBLESHOOTING
# ============================================

# If DATABASE_URL is not found:
# → Ensure .env file exists with DATABASE_URL

# If Prisma Client not generated:
# → Run: npx prisma generate

# If connection fails:
# → Check DATABASE_URL is correct
# → Verify PostgreSQL is running
# → For Neon, ensure SSL is enabled

# If port 5000 already in use:
# → Change PORT in .env or kill the process
# → powershell: lsof -i :5000 (Mac/Linux)
# → powershell: netstat -ano | findstr :5000 (Windows)
