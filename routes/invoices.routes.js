import { Router } from "express";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controllers.js";
import {
  detectDevice,
  requireMobile,
  allowDeviceOverride
} from "../middlewares/deviceDetection.js";

const router = Router();

// Aplicar detección de dispositivo a todas las rutas
router.use(detectDevice);

// Rutas de solo lectura (disponibles para todos los dispositivos)
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);

// Rutas de escritura (solo dispositivos móviles)
router.post("", requireMobile, createInvoice);
router.put("/:id", requireMobile, updateInvoice);
router.delete("/:id", requireMobile, deleteInvoice);

export default router;
