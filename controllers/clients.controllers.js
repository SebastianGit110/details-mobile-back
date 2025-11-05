import { pool } from "../db.js";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Crear cliente
export const createCliente = async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO Clientes (nombre, direccion, telefono) VALUES ($1, $2, $3) RETURNING id_cliente",
      [nombre, direccion, telefono]
    );
    res.status(201).json({ id: rows[0].id_cliente, nombre, direccion, telefono });
  } catch (error) {
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

// Editar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;

    const result = await pool.query(
      "UPDATE Clientes SET nombre=$1, direccion=$2, telefono=$3 WHERE id_cliente=$4",
      [nombre, direccion, telefono, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cliente", error });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM Clientes WHERE id_cliente = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error });
  }
};
