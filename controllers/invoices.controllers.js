import { pool } from "../db.js";

// Obtener todas las facturas
export const getInvoices = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id_factura AS id,
        c.nombre AS cliente,
        f.fecha AS fecha,
        f.total AS total,
        f.products AS products
      FROM Facturas f
      INNER JOIN Clientes c ON f.id_cliente = c.id_cliente
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
};

// Crear una nueva factura
export const createInvoice = async (req, res) => {
  try {
    const { cliente, fecha, total, products } = req.body;

    console.log(req.body);

    const [rows] = await pool.query(
      "SELECT id_cliente FROM Clientes WHERE nombre = ? LIMIT 1",
      [cliente]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `No se encontró el cliente con nombre: ${cliente}` });
    }

    const id_cliente = rows[0].id_cliente;

    console.log(id_cliente);

    if (!id_cliente || !fecha || total == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await pool.query(
      "INSERT INTO Facturas (id_cliente, fecha, total, products) VALUES (?, ?, ?, ?)",
      [id_cliente, fecha, total, products]
    );

    res.status(201).json({
      message: "Factura creada correctamente",
      factura: { id_factura: result.insertId, id_cliente, fecha, total },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la factura" });
  }
};

// Actualizar factura
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_cliente, fecha, total } = req.body;

    const [result] = await pool.query(
      "UPDATE Facturas SET id_cliente = ?, fecha = ?, total = ? WHERE id_factura = ?",
      [id_cliente, fecha, total, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Factura no encontrada" });

    res.json({ message: "Factura actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la factura" });
  }
};

// Eliminar factura
export const deleteInvoice = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM Facturas WHERE id_factura = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Factura no encontrada" });

    res.json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la factura" });
  }
};
