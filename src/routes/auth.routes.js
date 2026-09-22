import { Router } from "express";
import { body } from "express-validator";
import { login, perfil } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateErrors } from "../middlewares/validate.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isString().notEmpty().withMessage("Contraseña requerida"),
  ],
  validateErrors,
  login
);

router.get("/perfil", authMiddleware, perfil);

export default router;