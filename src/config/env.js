import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev_secret_no_seguro",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  tipoCambioDefault: Number(process.env.TIPO_CAMBIO_DEFAULT) || 6.96,
  alicuotaIVA: Number(process.env.ALICUOTA_IVA) || 14.94,
};