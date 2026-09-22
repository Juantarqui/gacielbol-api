import { Router } from "express";
import { body } from "express-validator";
import { ufvActual, registrarUfv, buscarAranceles } from "../controllers/parametroController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateErrors } from "../middlewares/validate.js";

const router = Router();

router.use(authMiddleware);

router.get("/ufv/actual", ufvActual);

router.post(
  "/ufv",
  [
    body("fecha").isISO8601().withMessage("Fecha inválida (formato ISO 8601)"),
    body("valor").isFloat({ gt: 0 }).withMessage("Valor UFV debe ser mayor a 0"),
  ],
  validateErrors,
  registrarUfv
);

router.get("/aranceles", buscarAranceles);

export default router;