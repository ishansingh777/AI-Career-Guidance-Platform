import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test Prisma connection with a simple query
    await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ PostgreSQL Connected via Prisma");
  } catch (err) {
    console.warn("⚠️ Database Connection Failed - Server will start anyway");
    console.warn(err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();