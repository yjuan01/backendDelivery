import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const restaurantesController = {
  async list(request: Request, response: Response): Promise<void> {
    try {
      const restaurantes = await prisma.restaurante.findMany({
        select: {
          id: true,
          nome: true,
          descricao: true,
          endereco: true,
          telefone: true,
          categoria: true,
          emoji: true,
          tempo: true,
          nota: true,
          taxa: true,
          criadoEm: true,
        },
        orderBy: { nome: "asc" },
      });

      response.status(200).json(restaurantes);
    } catch (err) {
      response.status(500).json({
        error: "Erro ao listar restaurantes.",
        detalhe: (err as Error).message,
      });
    }
  },

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const restaurante = await prisma.restaurante.findUnique({
        where: { id: Number(id) },
        include: {
          produtos: true,
        },
      });

      if (!restaurante) {
        response.status(404).json({ error: "Restaurante não encontrado." });
        return;
      }

      response.status(200).json(restaurante);
    } catch (err) {
      response.status(500).json({
        error: "Erro ao buscar restaurante.",
        detalhe: (err as Error).message,
      });
    }
  },

  async create(request: Request, response: Response): Promise<void> {
    const { nome, descricao, endereco, telefone, categoria, emoji, tempo, nota, taxa } =
      request.body;

    if (!nome || !endereco) {
      response
        .status(400)
        .json({ error: "Nome e endereço são obrigatórios." });
      return;
    }

    try {
      const restaurante = await prisma.restaurante.create({
        data: {
          nome,
          descricao,
          endereco,
          telefone,
          ...(categoria !== undefined && { categoria }),
          ...(emoji !== undefined && { emoji }),
          ...(tempo !== undefined && { tempo }),
          ...(nota !== undefined && { nota: Number(nota) }),
          ...(taxa !== undefined && { taxa: Number(taxa) }),
        },
      });

      response.status(201).json(restaurante);
    } catch (err) {
      response.status(500).json({
        error: "Erro ao criar restaurante.",
        detalhe: (err as Error).message,
      });
    }
  },

  async update(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const { nome, descricao, endereco, telefone, categoria, emoji, tempo, nota, taxa } =
      request.body;

    try {
      const data: Record<string, unknown> = {};
      if (nome !== undefined) data.nome = nome;
      if (descricao !== undefined) data.descricao = descricao;
      if (endereco !== undefined) data.endereco = endereco;
      if (telefone !== undefined) data.telefone = telefone;
      if (categoria !== undefined) data.categoria = categoria;
      if (emoji !== undefined) data.emoji = emoji;
      if (tempo !== undefined) data.tempo = tempo;
      if (nota !== undefined) data.nota = Number(nota);
      if (taxa !== undefined) data.taxa = Number(taxa);

      const restaurante = await prisma.restaurante.update({
        where: { id: Number(id) },
        data,
      });

      response.status(200).json(restaurante);
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Restaurante não encontrado." });
        return;
      }
      response.status(500).json({
        error: "Erro ao atualizar restaurante.",
        detalhe: err.message,
      });
    }
  },

  async deleteById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      // Deleta todos os itens de pedidos dos produtos do restaurante
      const produtos = await prisma.produto.findMany({
        where: { restauranteId: Number(id) }
      });

      for (const produto of produtos) {
        await prisma.itemPedido.deleteMany({
          where: { produtoId: produto.id }
        });
      }

      // Deleta todos os produtos do restaurante
      await prisma.produto.deleteMany({
        where: { restauranteId: Number(id) }
      });

      // Deleta todos os pedidos do restaurante
      await prisma.pedido.deleteMany({
        where: { restauranteId: Number(id) }
      });

      // Finalmente deleta o restaurante
      await prisma.restaurante.delete({ where: { id: Number(id) } });
      response
        .status(200)
        .json({ success: true, message: "Restaurante deletado com sucesso." });
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Restaurante não encontrado." });
        return;
      }
      response.status(500).json({
        error: "Erro ao deletar restaurante.",
        detalhe: err.message,
      });
    }
  },
};

export default restaurantesController;