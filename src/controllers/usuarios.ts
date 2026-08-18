import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";

const usuariosController = {
  async login(request: Request, response: Response): Promise<void> {
    const { email, senha } = request.body;

    if (!email || !senha) {
      response.status(400).json({ error: "Email e senha são obrigatórios." });
      return;
    }

    try {
      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        response.status(401).json({ error: "Credenciais inválidas." });
        return;
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        response.status(401).json({ error: "Credenciais inválidas." });
        return;
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      response.status(200).json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
      });
    } catch (err) {
      response.status(500).json({ error: "Erro ao fazer login.", detalhe: (err as Error).message });
    }
  },

  async registrar(request: Request, response: Response): Promise<void> {
    const { nome, email, senha, role } = request.body;

    if (!nome || !email || !senha) {
      response.status(400).json({ error: "Nome, email e senha são obrigatórios." });
      return;
    }

    try {
      const existe = await prisma.usuario.findUnique({ where: { email } });
      if (existe) {
        response.status(409).json({ error: "Email já cadastrado." });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: { nome, email, senha: senhaHash, role: role || "cliente" },
        select: { id: true, nome: true, email: true, role: true, criadoEm: true },
      });

      response.status(201).json(usuario);
    } catch (err) {
      response.status(500).json({ error: "Erro ao registrar usuário.", detalhe: (err as Error).message });
    }
  },

  async list(request: Request, response: Response): Promise<void> {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true, role: true, criadoEm: true, senha: true },
        orderBy: { nome: "asc" },
      });
      response.status(200).json(usuarios);
    } catch (err) {
      response.status(500).json({ error: "Erro ao listar usuários.", detalhe: (err as Error).message });
    }
  },

  async perfil(request: Request, response: Response): Promise<void> {
    const usuarioId = request.usuario?.id;

    if (!usuarioId) {
      response.status(401).json({ error: "Token inválido." });
      return;
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { id: true, nome: true, email: true, role: true, criadoEm: true },
      });

      if (!usuario) {
        response.status(404).json({ error: "Usuário não encontrado." });
        return;
      }

      response.status(200).json(usuario);
    } catch (err) {
      response.status(500).json({ error: "Erro ao buscar perfil do usuário.", detalhe: (err as Error).message });
    }
  },

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: { id: true, nome: true, email: true, role: true, criadoEm: true },
      });

      if (!usuario) {
        response.status(404).json({ error: "Usuário não encontrado." });
        return;
      }

      response.status(200).json(usuario);
    } catch (err) {
      response.status(500).json({ error: "Erro ao buscar usuário.", detalhe: (err as Error).message });
    }
  },

  async update(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const { nome, email, senha } = request.body;

    try {
      const data: any = {};
      if (nome) data.nome = nome;
      if (email) data.email = email;
      if (senha) data.senha = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data,
        select: { id: true, nome: true, email: true, role: true },
      });

      response.status(200).json(usuario);
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Usuário não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao atualizar usuário.", detalhe: err.message });
    }
  },

  async deleteById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      // Primeiro deleta todos os pedidos associados ao usuário
      await prisma.pedido.deleteMany({
        where: { usuarioId: Number(id) }
      });

      // Depois deleta o usuário
      await prisma.usuario.delete({ where: { id: Number(id) } });
      response.status(200).json({ success: true, message: "Usuário deletado com sucesso." });
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Usuário não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao deletar usuário.", detalhe: err.message });
    }
  },
};

export default usuariosController;