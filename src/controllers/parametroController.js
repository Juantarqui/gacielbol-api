import prisma from "../config/db.js";

export async function ufvActual(req, res, next) {
  try {
    const ufv = await prisma.cotizacionUfv.findFirst({
      orderBy: { fecha: "desc" },
    });

    if (!ufv) {
      return res.status(404).json({ exito: false, mensaje: "No existen cotizaciones UFV registradas" });
    }

    return res.json({ exito: true, mensaje: "Cotización UFV vigente", datos: ufv });
  } catch (error) {
    next(error);
  }
}

export async function registrarUfv(req, res, next) {
  try {
    const { fecha, valor } = req.body;

    const ufv = await prisma.cotizacionUfv.upsert({
      where: { fecha: new Date(fecha) },
      update: { valor },
      create: { fecha: new Date(fecha), valor },
    });

    return res.status(201).json({
      exito: true,
      mensaje: "Cotización UFV registrada",
      datos: ufv,
    });
  } catch (error) {
    next(error);
  }
}

export async function buscarAranceles(req, res, next) {
  try {
    const q = (req.query.q || "").toString().trim();

    const where = q
      ? {
          activo: true,
          OR: [
            { codigo: { contains: q, mode: "insensitive" } },
            { descripcion: { contains: q, mode: "insensitive" } },
          ],
        }
      : { activo: true };

    const partidas = await prisma.partidaArancelaria.findMany({
      where,
      take: 50,
      orderBy: { codigo: "asc" },
    });

    return res.json({
      exito: true,
      mensaje: "Partidas arancelarias encontradas",
      datos: partidas,
    });
  } catch (error) {
    next(error);
  }
}