import bcrypt from "bcryptjs";
import prisma from "../src/config/db.js";

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@gacielbol.com" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@gacielbol.com",
      password,
      rol: "ADMIN",
    },
  });
  console.log("Usuario admin: ", admin.email);

  await prisma.partidaArancelaria.upsert({
    where: { codigo: "2710.12" },
    update: {},
    create: { codigo: "2710.12", descripcion: "Aceites de petróleo ligeros", porcentajeGA: 10 },
  });

  await prisma.partidaArancelaria.upsert({
    where: { codigo: "8418.21" },
    update: {},
    create: { codigo: "8418.21", descripcion: "Refrigeradores de uso doméstico", porcentajeGA: 20 },
  });

  await prisma.cliente.upsert({
    where: { nit: "1023409012" },
    update: {},
    create: { nit: "1023409012", razonSocial: "Gacielbol SRL", direccion: "Av. Banzer, Santa Cruz", telefono: "591 3 3500000" },
  });
  console.log("Datos semilla creados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());