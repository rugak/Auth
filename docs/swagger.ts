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
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', 
      name: 'X-API-KEY',
      description: 'Some description...'
    }
  },
  host: "localhost:" + process.env.PORT,
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    
    {
      name: "Account",
      description: "Endpoints pour la gestion des utilisateurs",
    },
    {
      name: "Refresh Token",
      description: "Endpoints pour la gestion des tokens",
    },
    {
      name: "Access Token",
      description: "Endpoints pour la gestion des tokens",
    },
  ],
  definitions: {},
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["../src/routers/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
