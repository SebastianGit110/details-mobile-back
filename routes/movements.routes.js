import { Router } from "express";
import {
  getMovements,
  createMovement,
  updateMovement,
  deleteMovement,
} from "../controllers/movements.controllers.js";

const router = Router();

router.get("/", getMovements);
router.post("/", createMovement);
router.put("/:id", updateMovement);
router.delete("/:id", deleteMovement);

export default router;
