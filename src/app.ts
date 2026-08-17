import express from "express";
import cors from "cors";
import routes from "./routes";
import { serve, setup } from "swagger-ui-express";
import packageJson from "../package.json";
import swaggerConfig from "../config/swaggerConfig";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(routes);

app.use(
  "/docs",
  serve,
  setup({
    openapi: "3.0.0",
    info: {
      title: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    paths: {
      "/": swaggerConfig.initialRoute,

      "/usuarios": swaggerConfig.usuarioRoutesNoId,
      "/usuarios/registrar": swaggerConfig.usuarioRegistrarRoute,
      "/usuarios/login": swaggerConfig.usuarioLoginRoute,
      "/usuarios/{id}": swaggerConfig.usuarioByIdRoute,

      "/restaurantes": swaggerConfig.restauranteRoutesNoId,
      "/restaurantes/{id}": swaggerConfig.restauranteByIdRoute,

      "/produtos/restaurante/{restauranteId}": swaggerConfig.produtosByRestauranteRoute,
      "/produtos": swaggerConfig.produtoRoutesNoId,
      "/produtos/{id}": swaggerConfig.produtoByIdRoute,

      "/pedidos": swaggerConfig.pedidoRoutesNoId,
      "/pedidos/meus": swaggerConfig.pedidosMeusRoute,
      "/pedidos/{id}": swaggerConfig.pedidoByIdRoute,
      "/pedidos/{id}/status": swaggerConfig.pedidoStatusRoute,
    },
    tags: [
      { name: "Rota Inicial", description: "Checar funcionamento do servidor" },
      { name: "Usuários", description: "CRUD de usuários" },
      { name: "Restaurantes", description: "CRUD de restaurantes" },
      { name: "Produtos", description: "CRUD de produtos" },
      { name: "Pedidos", description: "CRUD de pedidos" },
    ],
    components: {
      schemas: {
        Usuario: swaggerConfig.usuarioSchema,
        Restaurante: swaggerConfig.restauranteSchema,
        Produto: swaggerConfig.produtoSchema,
        Pedido: swaggerConfig.pedidoSchema,
        ItemPedido: swaggerConfig.itemPedidoSchema,
      },
    },
  }),
);

export default app;