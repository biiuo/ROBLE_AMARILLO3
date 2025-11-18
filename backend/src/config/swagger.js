import swaggerUI from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const swaggerDocument = require("./swagger.json");

export const swaggerConfig = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};