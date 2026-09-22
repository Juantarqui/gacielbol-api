import { Router } from "express";
import authRoutes from "./auth.routes.js";
import clienteRoutes from "./cliente.routes.js";
import parametroRoutes from "./parametro.routes.js";
import liquidacionRoutes from "./liquidacion.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clienteRoutes);
router.use("/parametros", parametroRoutes);
router.use("/liquidaciones", liquidacionRoutes);

export default router;