import pkg from "pg";
const { Pool } = pkg;

// Configuración de la conexión a PostgreSQL
// En Render, DATABASE_URL contiene toda la información de conexión
const config = process.env.DATABASE_URL
  ? {
      // Si hay DATABASE_URL, úsala directamente (Render)
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      // Si no hay DATABASE_URL, usa las variables individuales (desarrollo local)
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "detailsmobile",
    };

export const pool = new Pool(config);

// Verificar conexión
pool.on("connect", () => {
  console.log("✅ Conectado a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error inesperado en la conexión a PostgreSQL:", err);
});