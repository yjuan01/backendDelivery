import { Router } from "express";
import { authentication } from "./middlewares/authentication";
import restaurantesController from "./controllers/restaurantes";
import produtosController from "./controllers/produtos";
import pedidosController from "./controllers/pedidos";
import usuariosController from "./controllers/usuarios";

const routes = Router();

routes.get("/", (request, response) => response.status(200).json({ success: true }));

// ─── Usuários ────────────────────────────────────────────────────────────────
routes.post("/usuarios/login", usuariosController.login);
routes.post("/usuarios/registrar", usuariosController.registrar);
routes.get("/usuarios", usuariosController.list);
routes.get("/usuarios/:id", usuariosController.getById);
routes.put("/usuarios/:id", usuariosController.update);  
routes.delete("/usuarios/:id", usuariosController.deleteById);

// ─── Restaurantes ─────────────────────────────────────────────────────────────
routes.get("/restaurantes", restaurantesController.list);
routes.get("/restaurantes/:id", restaurantesController.getById);
routes.post("/restaurantes", restaurantesController.create);
routes.put("/restaurantes/:id", restaurantesController.update);
routes.delete("/restaurantes/:id", restaurantesController.deleteById);

// ─── Produtos ────────────────────────────────────────────────────────────────
routes.get("/produtos/restaurante/:restauranteId", produtosController.listByRestaurante);
routes.get("/produtos/:id", produtosController.getById);
routes.post("/produtos", produtosController.create);
routes.put("/produtos/:id", produtosController.update);
routes.delete("/produtos/:id", produtosController.deleteById);

// ─── Pedidos ─────────────────────────────────────────────────────────────────
routes.get("/pedidos", pedidosController.list);
routes.get("/pedidos/meus", pedidosController.listMeus);
routes.get("/pedidos/:id", pedidosController.getById);
routes.post("/pedidos", pedidosController.create);
routes.patch("/pedidos/:id/status", pedidosController.updateStatus);
routes.delete("/pedidos/:id", pedidosController.deleteById);

export default routes;