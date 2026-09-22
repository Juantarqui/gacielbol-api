export function notFoundHandler(req, res) {
  return res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ exito: false, mensaje: "JSON inválido en el cuerpo de la petición" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ exito: false, mensaje: "Registro duplicado en la base de datos" });
  }

  console.error(err);
  const status = err.status || 500;
  const mensaje = status === 500 ? "Error interno del servidor" : err.message;

  return res.status(status).json({ exito: false, mensaje });
}