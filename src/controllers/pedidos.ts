import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const STATUS_VALIDOS = ["pendente", "confirmado", "em_preparo", "saiu_entrega", "entregue", "cancelado"];

const pedidos = {
  async list(request: Request, response: Response): Promise<void> {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
          restaurante: { select: { id: true, nome: true } },
          itens: { include: { produto: { select: { id: true, nome: true } } } },
        },
        orderBy: { criadoEm: "desc" },
      });
      response.status(200).json(pedidos);
    } catch (err) {
      response.status(500).json({ error: "Erro ao listar pedidos.", detalhe: (err as Error).message });
    }
  },

  async listMeus(request: Request, response: Response): Promise<void> {
    const usuarioId = request.usuario?.id;

    try {
      const pedidos = await prisma.pedido.findMany({
        where: { usuarioId },
        include: {
          restaurante: { select: { id: true, nome: true } },
          itens: { include: { produto: { select: { id: true, nome: true } } } },
        },
        orderBy: { criadoEm: "desc" },
      });
      response.status(200).json(pedidos);
    } catch (err) {
      response.status(500).json({ error: "Erro ao listar pedidos.", detalhe: (err as Error).message });
    }
  },

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const usuarioId = request.usuario?.id;
    const isAdmin = request.usuario?.role === "admin";

    try {
      const pedido = await prisma.pedido.findUnique({
        where: { id: Number(id) },
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
          restaurante: { select: { id: true, nome: true, endereco: true } },
          itens: { include: { produto: { select: { id: true, nome: true } } } },
        },
      });

      if (!pedido) {
        response.status(404).json({ error: "Pedido não encontrado." });
        return;
      }

      if (!isAdmin && pedido.usuarioId !== usuarioId) {
        response.status(403).json({ error: "Sem permissão para ver este pedido." });
        return;
      }

      response.status(200).json(pedido);
    } catch (err) {
      response.status(500).json({ error: "Erro ao buscar pedido.", detalhe: (err as Error).message });
    }
  },

  async create(request: Request, response: Response): Promise<void> {
    const usuarioId = request.usuario?.id as number;
    const { restauranteId, itens, observacao } = request.body;

    // itens: [{ produtoId, quantidade }]
    if (!restauranteId || !itens || !Array.isArray(itens) || itens.length === 0) {
      response.status(400).json({ error: "restauranteId e pelo menos um item são obrigatórios." });
      return;
    }

    try {
      const ids: number[] = itens.map((i: any) => i.produtoId);

      const produtos = await prisma.produto.findMany({
        where: { id: { in: ids }, restauranteId: Number(restauranteId), disponivel: true },
      });

      if (produtos.length !== ids.length) {
        response.status(400).json({ error: "Um ou mais produtos não encontrados ou indisponíveis." });
        return;
      }

      const produtoMap = Object.fromEntries(produtos.map((p) => [p.id, p]));

      let total = 0;
      const itensMapeados = itens.map((item: any) => {
        const produto = produtoMap[item.produtoId];
        total += produto.preco * item.quantidade;
        return {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUni: produto.preco,
        };
      });

      const pedido = await prisma.pedido.create({
        data: {
          usuarioId,
          restauranteId: Number(restauranteId),
          total,
          observacao,
          itens: { create: itensMapeados },
        },
        include: {
          restaurante: { select: { id: true, nome: true } },
          itens: { include: { produto: { select: { id: true, nome: true } } } },
        },
      });

      response.status(201).json(pedido);
    } catch (err) {
      response.status(500).json({ error: "Erro ao criar pedido.", detalhe: (err as Error).message });
    }
  },

  async updateStatus(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const { status } = request.body;

    if (!STATUS_VALIDOS.includes(status)) {
      response.status(400).json({ error: `Status inválido. Use: ${STATUS_VALIDOS.join(", ")}` });
      return;
    }

    try {
      const pedido = await prisma.pedido.update({
        where: { id: Number(id) },
        data: { status },
      });
      response.status(200).json(pedido);
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Pedido não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao atualizar status.", detalhe: err.message });
    }
  },

  async deleteById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      await prisma.pedido.delete({ where: { id: Number(id) } });
      response.status(200).json({ success: true, message: "Pedido deletado com sucesso." });
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Pedido não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao deletar pedido.", detalhe: err.message });
    }
  },
};

export default pedidos;