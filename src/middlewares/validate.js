import { validationResult } from "express-validator";

export function validateErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: "Error de validación",
      detalles: errors.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}