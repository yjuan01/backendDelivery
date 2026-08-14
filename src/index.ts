import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});