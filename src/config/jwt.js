import jwt from "jsonwebtoken";
import { env } from "./env.js";

export const jwtConfig = {
  secret: env.jwtSecret,
  expiresIn: env.jwtExpiresIn,

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  },

  verify(token) {
    return jwt.verify(token, this.secret);
  },
};