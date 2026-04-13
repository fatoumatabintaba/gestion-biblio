import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bibliothèque TECH 221",
      version: "2.0.0",
      description: "API de gestion de bibliothèque",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // IMPORTANT ✔
      },
    ],
  },

  // IMPORTANT : chemin vers tes routes
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
