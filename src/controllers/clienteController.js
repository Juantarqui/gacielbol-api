import prisma from "../config/db.js";

export async function listarClientes(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const q = (req.query.q || "").toString().trim();

    const where = q
      ? {
          OR: [
            { nit: { contains: q, mode: "insensitive" } },
            { razonSocial: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [total, clientes] = await Promise.all([
      prisma.cliente.count({ where }),
      prisma.cliente.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.json({
      exito: true,
      mensaje: "Clientes obtenidos",
      datos: clientes,
      meta: { page, limit, total, totalPaginas: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function crearCliente(req, res, next) {
  try {
    const { nit, razonSocial, direccion, telefono, email } = req.body;

    const cliente = await prisma.cliente.create({
      data: { nit, razonSocial, direccion, telefono, email },
    });

    return res.status(201).json({
      exito: true,
      mensaje: "Cliente registrado correctamente",
      datos: cliente,
    });
  } catch (error) {
    next(error);
  }
}