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
routes.get("/usuarios/perfil", authentication, usuariosController.perfil);
routes.get("/usuarios/:id", authentication, usuariosController.getById);
routes.put("/usuarios/:id", authentication, usuariosController.update);
routes.delete("/usuarios/:id", authentication, usuariosController.deleteById);

// ─── Restaurantes ─────────────────────────────────────────────────────────────
routes.get("/restaurantes",  restaurantesController.list);
routes.get("/restaurantes/:id", authentication, restaurantesController.getById);
routes.post("/restaurantes", authentication, restaurantesController.create);
routes.put("/restaurantes/:id", authentication, restaurantesController.update);
routes.delete("/restaurantes/:id", authentication, restaurantesController.deleteById);

// ─── Produtos ────────────────────────────────────────────────────────────────
routes.get("/produtos/restaurante/:restauranteId", authentication, produtosController.listByRestaurante);
routes.get("/produtos/:id", authentication, produtosController.getById);
routes.post("/produtos", authentication, produtosController.create);
routes.put("/produtos/:id", authentication, produtosController.update);
routes.delete("/produtos/:id", authentication, produtosController.deleteById);

// ─── Pedidos ─────────────────────────────────────────────────────────────────
routes.get("/pedidos", authentication, pedidosController.list);
routes.get("/pedidos/meus", authentication, pedidosController.listMeus);
routes.get("/pedidos/:id", authentication, pedidosController.getById);
routes.post("/pedidos", authentication, pedidosController.create);
routes.patch("/pedidos/:id/status", authentication, pedidosController.updateStatus);
routes.delete("/pedidos/:id", authentication, pedidosController.deleteById);

export default routes