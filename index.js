import express from "express";
import cors from "cors";
import clientsRoutes from "./routes/clients.routes.js";
import productsRoutes from "./routes/products.routes.js";
import invoicesRoutes from "./routes/invoices.routes.js";
import movementsRoutes from "./routes/movements.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/clients", clientsRoutes);
app.use("/products", productsRoutes);
app.use("/invoices", invoicesRoutes);
app.use("/movements", movementsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
