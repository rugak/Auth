import dotenv from "dotenv";
import express from "express";
import mainRouter from "./routers";
dotenv.config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

export const JWT_SECRET = process.env.JWT_SECRET!;
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/api`);
  console.log(
    `You can see swagger doc on http://localhost:${process.env.PORT}/api-docs`
  );
});
