import { jwtConfig } from "../config/jwt.js";
import prisma from "../config/db.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ exito: false, mensaje: "Token no proporcionado" });
    }

    const token = header.split(" ")[1];
    const payload = jwtConfig.verify(token);

    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.sub, activo: true },
    });

    if (!usuario) {
      return res.status(401).json({ exito: false, mensaje: "Usuario no válido o inactivo" });
    }

    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ exito: false, mensaje: "Token inválido o expirado" });
  }
}