import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { jwtConfig } from "../config/jwt.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ exito: false, mensaje: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ exito: false, mensaje: "Credenciales inválidas" });
    }

    if (!usuario.activo) {
      return res.status(403).json({ exito: false, mensaje: "Usuario inactivo, contacte al administrador" });
    }

    const token = jwtConfig.sign({
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    return res.json({
      exito: true,
      mensaje: "Inicio de sesión exitoso",
      datos: {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function perfil(req, res, next) {
  try {
    const { password: _omitir, ...usuario } = req.usuario;
    return res.json({ exito: true, mensaje: "Perfil del usuario autenticado", datos: usuario });
  } catch (error) {
    next(error);
  }
}