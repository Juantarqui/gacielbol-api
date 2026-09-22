import { Router } from "express";
import { body } from "express-validator";
import {
  calcular,
  crearLiquidacion,
  listarLiquidaciones,
  detalleLiquidacion,
} from "../controllers/liquidacionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateErrors } from "../middlewares/validate.js";

const router = Router();

router.use(authMiddleware);

const numerosValidacion = [
  body("fobUSD").optional().isFloat({ min: 0 }).withMessage("FOB debe ser un número mayor o igual a 0"),
  body("fleteUSD").optional().isFloat({ min: 0 }).withMessage("Flete debe ser un número mayor o igual a 0"),
  body("seguroUSD").optional().isFloat({ min: 0 }).withMessage("Seguro debe ser un número mayor o igual a 0"),
  body("otrosGastosUSD").optional().isFloat({ min: 0 }).withMessage("Otros gastos USD deben ser números mayor o igual a 0"),
  body("otrosGastosAdBOB").optional().isFloat({ min: 0 }).withMessage("Otros gastos aduaneros (BOB) deben ser números mayor o igual a 0"),
  body("gaPorcentaje").optional().isFloat({ min: 0, max: 100 }).withMessage("GA debe estar entre 0 y 100"),
  body("tipoCambio").optional().isFloat({ gt: 0 }).withMessage("Tipo de cambio debe ser mayor a 0"),
];

router.post(
  "/calcular",
  [
    body("fobUSD").isFloat({ min: 0 }).withMessage("FOB es requerido y debe ser mayor o igual a 0"),
    ...numerosValidacion,
  ],
  validateErrors,
  calcular
);

router.get("/", listarLiquidaciones);

router.get("/:id", detalleLiquidacion);

router.post(
  "/",
  [
    body("clienteId").isInt().withMessage("Cliente requerido (ID válido)"),
    body("fobUSD").isFloat({ min: 0 }).withMessage("FOB es requerido y debe ser mayor o igual a 0"),
    ...numerosValidacion,
  ],
  validateErrors,
  crearLiquidacion
);

export default router;