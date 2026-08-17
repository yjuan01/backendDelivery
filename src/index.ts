import dotenv from "dotenv";
import http from "http";
import app from "./app";

dotenv.config();

const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 8080;

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} já está em uso.`);
    process.exit(1);
  }
  console.error("Erro no servidor:", error);
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});