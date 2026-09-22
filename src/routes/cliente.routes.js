import { Router } from "express";
import { body } from "express-validator";
import { listarClientes, crearCliente } from "../controllers/clienteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateErrors } from "../middlewares/validate.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listarClientes);

router.post(
  "/",
  [
    body("nit").isString().notEmpty().withMessage("NIT requerido"),
    body("razonSocial").isString().notEmpty().withMessage("Razón social requerida"),
    body("email").optional().isEmail().withMessage("Email inválido"),
  ],
  validateErrors,
  crearCliente
);

export default router;