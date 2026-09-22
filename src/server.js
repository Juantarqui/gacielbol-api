import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Servidor Gacielbol API corriendo en http://localhost:${env.port}`);
  console.log(`Entorno: ${env.nodeEnv}`);
});