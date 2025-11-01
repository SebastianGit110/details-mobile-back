import { Router } from "express";
import {
  createProducto,
  deleteProducto,
  getProductos,
  getProductosA,
  updateProducto,
  updateProducts,
} from "../controllers/products.controllers.js";

const router = Router();

router.get("/", getProductos);
router.get("/a", getProductosA);
router.post("/", createProducto);
router.put("/:id", updateProducto);
router.put("/", updateProducts);
router.delete("/:id", deleteProducto);

export default router;
