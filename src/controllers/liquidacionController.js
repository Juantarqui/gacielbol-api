import prisma from "../config/db.js";
import { calcularLiquidacion } from "../services/calculoService.js";
import { env } from "../config/env.js";

export async function calcular(req, res, next) {
  try {
    const {
      fobUSD,
      fleteUSD,
      seguroUSD,
      otrosGastosUSD,
      otrosGastosAdBOB,
      gaPorcentaje,
      tipoCambio = env.tipoCambioDefault,
      alicuotaIVA = env.alicuotaIVA,
    } = req.body;

    const desglose = calcularLiquidacion({
      fobUSD,
      fleteUSD,
      seguroUSD,
      otrosGastosUSD,
      otrosGastosAdBOB,
      gaPorcentaje,
      tipoCambio,
      alicuotaIVA,
    });

    return res.json({
      exito: true,
      mensaje: "Cálculo de liquidación aduanera realizado",
      datos: desglose,
    });
  } catch (error) {
    next(error);
  }
}

export async function crearLiquidacion(req, res, next) {
  try {
    const {
      clienteId,
      partidaArancelariaId,
      fobUSD,
      fleteUSD,
      seguroUSD,
      otrosGastosUSD,
      otrosGastosAdBOB = 0,
      gaPorcentaje,
      observacion,
    } = req.body;

    let tipoCambio = Number(req.body.tipoCambio) || null;
    if (!tipoCambio) {
      tipoCambio = env.tipoCambioDefault;
    }

    let ga = null;
    if (partidaArancelariaId) {
      const partida = await prisma.partidaArancelaria.findUnique({
        where: { id: Number(partidaArancelariaId) },
      });
      if (!partida) {
        return res.status(404).json({ exito: false, mensaje: "Partida arancelaria no encontrada" });
      }
      ga = Number(partida.porcentajeGA);
    }
    if (gaPorcentaje !== undefined && gaPorcentaje !== null) {
      ga = Number(gaPorcentaje);
    }

    const calculo = calcularLiquidacion({
      fobUSD,
      fleteUSD,
      seguroUSD,
      otrosGastosUSD,
      otrosGastosAdBOB,
      gaPorcentaje: ga ?? 0,
      tipoCambio,
      alicuotaIVA: env.alicuotaIVA,
    });

    const liquidacion = await prisma.liquidacion.create({
      data: {
        clienteId: Number(clienteId),
        usuarioId: req.usuario.id,
        partidaArancelariaId: partidaArancelariaId ? Number(partidaArancelariaId) : null,
        fobUSD,
        fleteUSD,
        seguroUSD,
        otrosGastosUSD,
        otrosGastosAdBOB,
        tipoCambio,
        cifUSD: calculo.resultado.cifUSD,
        cifBOB: calculo.resultado.cifBOB,
        gaPorcentaje: ga ?? 0,
        gaBOB: calculo.resultado.gaBOB,
        baseImponibleIVA: calculo.resultado.baseImponibleIVA,
        ivaBOB: calculo.resultado.ivaBOB,
        totalTributosBOB: calculo.resultado.totalTributosBOB,
        observacion,
      },
      include: { cliente: true, usuario: true, partida: true },
    });

    return res.status(201).json({
      exito: true,
      mensaje: "Liquidación registrada",
      datos: liquidacion,
    });
  } catch (error) {
    next(error);
  }
}

export async function listarLiquidaciones(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const clienteId = req.query.clienteId ? Number(req.query.clienteId) : undefined;
    const estado = req.query.estado;

    const where = {};
    if (clienteId) where.clienteId = clienteId;
    if (estado) where.estado = estado;

    const [total, liquidaciones] = await Promise.all([
      prisma.liquidacion.count({ where }),
      prisma.liquidacion.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { cliente: true },
      }),
    ]);

    return res.json({
      exito: true,
      mensaje: "Historial de liquidaciones",
      datos: liquidaciones,
      meta: { page, limit, total, totalPaginas: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function detalleLiquidacion(req, res, next) {
  try {
    const id = Number(req.params.id);

    const liquidacion = await prisma.liquidacion.findUnique({
      where: { id },
      include: { cliente: true, usuario: true, partida: true },
    });

    if (!liquidacion) {
      return res.status(404).json({ exito: false, mensaje: "Liquidación no encontrada" });
    }

    return res.json({ exito: true, mensaje: "Detalle de liquidación", datos: liquidacion });
  } catch (error) {
    next(error);
  }
}