import express from "express";
import cors from "cors";
import routes from "./routes";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "../config/swaggerConfig";

// Inicializa o express
const app = express();

// Define regras do servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configura as rotas no servidor
app.use(routes);

// Configura a documentação
app.use(
  "/docs",
  serve,
  setup(swaggerConfig),
);

export default app;