import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const produtosController = {
  async listByRestaurante(request: Request, response: Response): Promise<void> {
    const { restauranteId } = request.params;

    try {
      const produtos = await prisma.produto.findMany({
        where: { restauranteId: Number(restauranteId) },
        orderBy: { nome: "asc" },
      });
      response.status(200).json(produtos);
    } catch (err) {
      response.status(500).json({ error: "Erro ao listar produtos.", detalhe: (err as Error).message });
    }
  },

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const produto = await prisma.produto.findUnique({
        where: { id: Number(id) },
        include: { restaurante: { select: { id: true, nome: true } } },
      });

      if (!produto) {
        response.status(404).json({ error: "Produto não encontrado." });
        return;
      }

      response.status(200).json(produto);
    } catch (err) {
      response.status(500).json({ error: "Erro ao buscar produto.", detalhe: (err as Error).message });
    }
  },

  async create(request: Request, response: Response): Promise<void> {
    const { nome, descricao, preco, restauranteId } = request.body;

    if (!nome || preco == null || !restauranteId) {
      response.status(400).json({ error: "Nome, preço e restauranteId são obrigatórios." });
      return;
    }

    try {
      const produto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          preco: Number(preco),
          restauranteId: Number(restauranteId),
        },
      });
      response.status(201).json(produto);
    } catch (err) {
      response.status(500).json({ error: "Erro ao criar produto.", detalhe: (err as Error).message });
    }
  },

  async update(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const { nome, descricao, preco, disponivel } = request.body;

    try {
      const produto = await prisma.produto.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          preco: preco != null ? Number(preco) : undefined,
          disponivel,
        },
      });
      response.status(200).json(produto);
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Produto não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao atualizar produto.", detalhe: err.message });
    }
  },

  async deleteById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      // Deleta todos os itens de pedido associados ao produto
      await prisma.itemPedido.deleteMany({
        where: { produtoId: Number(id) }
      });

      // Deleta o produto
      await prisma.produto.delete({ where: { id: Number(id) } });
      response.status(200).json({ success: true, message: "Produto deletado com sucesso." });
    } catch (err: any) {
      if (err.code === "P2025") {
        response.status(404).json({ error: "Produto não encontrado." });
        return;
      }
      response.status(500).json({ error: "Erro ao deletar produto.", detalhe: err.message });
    }
  },
};

export default produtosController;