import dotenv from "dotenv";
import swaggerAutogen from "swagger-autogen";
dotenv.config();

const doc = {
  info: {
    version: "2.0.0",
    title: "Authentication REST API",
    description: "API for authentication and authorization of users",
    contact: {
      name: "API Support",
      email: "",
    },
  },
  host: "localhost:" + process.env.PORT,
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Welcome",
      description: "Endpoints de base de l'API",
    },
    {
      name: "User",
      description: "Endpoints pour la gestion des utilisateurs",
    },
    {
      name: "Token",
      description: "Endpoints pour la gestion des tokens",
    },
  ],
  securityDefinitions: {},
  definitions: {},
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["../src/routers/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
