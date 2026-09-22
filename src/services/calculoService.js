// =====================================================================
// Servicio de Cálculo de Liquidación Aduanera (Bolivia)
// Caso: Grupo Logístico Gacielbol SRL
// =====================================================================

// Valores base configurables (sobrescribibles vía .env)
export const TIPO_CAMBIO_DEFAULT = 6.96; // BOB por 1 USD
export const ALICUOTA_IVA = 14.94; // Alícuota base del IVA aduanero (%)

export function redondear(valor, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.round((Number(valor) + Number.EPSILON) * factor) / factor;
}

// Fórmula 1: CIF_USD = FOB + Flete + Seguro + OtrosGastos
export function calcularCIF({ fobUSD = 0, fleteUSD = 0, seguroUSD = 0, otrosGastosUSD = 0 }) {
  const cifUSD =
    Number(fobUSD) +
    Number(fleteUSD) +
    Number(seguroUSD) +
    Number(otrosGastosUSD);
  return redondear(cifUSD);
}

// Fórmulas 2 a 6 aplicadas en orden
export function calcularLiquidacion(insumos) {
  const {
    fobUSD = 0,
    fleteUSD = 0,
    seguroUSD = 0,
    otrosGastosUSD = 0,
    otrosGastosAdBOB = 0,
    gaPorcentaje = 0,
    tipoCambio = TIPO_CAMBIO_DEFAULT,
    alicuotaIVA = ALICUOTA_IVA,
  } = insumos;

  // Fórmula 1: CIF_USD = FOB + Flete + Seguro + OtrosGastos
  const cifUSD = calcularCIF({ fobUSD, fleteUSD, seguroUSD, otrosGastosUSD });

  // Fórmula 2: CIF_BOB = CIF_USD × TipoCambio
  const cifBOB = redondear(cifUSD * Number(tipoCambio));

  // Fórmula 3: GA_BOB = CIF_BOB × (%GA / 100)
  const gaBOB = redondear(cifBOB * (Number(gaPorcentaje) / 100));

  // Fórmula 4: BaseImponibleIVA = CIF_BOB + GA_BOB + OtrosGastosAduaneros
  const baseImponibleIVA = redondear(cifBOB + gaBOB + Number(otrosGastosAdBOB));

  // Fórmula 5: IVA_BOB = BaseImponibleIVA × (14.94 / 100)
  const ivaBOB = redondear(baseImponibleIVA * (Number(alicuotaIVA) / 100));

  // Fórmula 6: TotalTributos_BOB = GA_BOB + IVA_BOB
  const totalTributosBOB = redondear(gaBOB + ivaBOB);

  return {
    resultado: { cifUSD, cifBOB, gaBOB, baseImponibleIVA, ivaBOB, totalTributosBOB },
    desglose: {
      fobUSD: redondear(fobUSD),
      fleteUSD: redondear(fleteUSD),
      seguroUSD: redondear(seguroUSD),
      otrosGastosUSD: redondear(otrosGastosUSD),
      otrosGastosAdBOB: redondear(otrosGastosAdBOB),
      gaPorcentaje: Number(gaPorcentaje),
      tipoCambio: Number(tipoCambio),
      alicuotaIVA: Number(alicuotaIVA),
    },
  };
}