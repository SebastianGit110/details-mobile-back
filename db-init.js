// Script para inicializar las tablas automáticamente
import { pool } from "./db.js";

export async function initializeDatabase() {
  try {
    console.log("🔧 Inicializando base de datos...");

    // Crear tabla de Clientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Clientes (
        id_cliente SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        direccion VARCHAR(255),
        telefono VARCHAR(50)
      )
    `);
    console.log("✅ Tabla 'Clientes' verificada/creada");

    // Crear tabla de Productos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Productos (
        id_producto VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log("✅ Tabla 'Productos' verificada/creada");

    // Crear tabla de Facturas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Facturas (
        id_factura SERIAL PRIMARY KEY,
        id_cliente INTEGER NOT NULL,
        fecha TIMESTAMP NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        products INTEGER,
        FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
      )
    `);
    console.log("✅ Tabla 'Facturas' verificada/creada");

    // Crear tabla de Movimientos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Movimientos (
        id_movimiento SERIAL PRIMARY KEY,
        id_factura INTEGER,
        id_cliente INTEGER,
        id_producto VARCHAR(50) NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario_facturado DECIMAL(10, 2) NOT NULL,
        precio_total_linea DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (id_factura) REFERENCES Facturas(id_factura),
        FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
        FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
      )
    `);
    console.log("✅ Tabla 'Movimientos' verificada/creada");

    // Crear índices para mejorar el rendimiento
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON Facturas(id_cliente)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_movimientos_factura ON Movimientos(id_factura)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_movimientos_cliente ON Movimientos(id_cliente)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON Movimientos(id_producto)
    `);
    console.log("✅ Índices creados");

    console.log("🎉 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    throw error;
  }
}

