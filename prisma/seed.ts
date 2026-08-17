import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

async function main() {
  // Usuário admin
  const senhaAdmin = bcrypt.hashSync("admin123", 10);

  const admin = await prisma.usuario.create({
    data: {
      nome: "Administrador",
      email: "admin@delivery.com",
      senha: senhaAdmin,
      role: "admin",
    },
  });

  console.log("Admin criado:", admin);

  // Usuário cliente
  const senhaCliente = bcrypt.hashSync("cliente123", 10);

  const cliente = await prisma.usuario.create({
    data: {
      nome: "João Silva",
      email: "joao@email.com",
      senha: senhaCliente,
      role: "cliente",
    },
  });

  console.log("Cliente criado:", cliente);

  // Restaurante principal (com produtos e pedido)
  const restaurante = await prisma.restaurante.create({
    data: {
      nome: "Burger House",
      descricao: "Hambúrguer artesanal",
      endereco: "Rua Central, 123",
      telefone: "(41) 99999-9999",
      categoria: "Hamburgueria",
      emoji: "🍔",
      tempo: "25-35 min",
      nota: 4.7,
      taxa: 6.9,
    },
  });

  console.log("Restaurante criado:", restaurante);

  // Outros restaurantes só pra popular o grid
  const outrosRestaurantes = await prisma.restaurante.createMany({
    data: [
      {
        nome: "Sushi Kaze",
        descricao: "Sushi e temakis fresquinhos",
        endereco: "Av. das Flores, 500",
        telefone: "(41) 98888-1111",
        categoria: "Japonesa",
        emoji: "🍣",
        tempo: "35-45 min",
        nota: 4.8,
        taxa: 9.9,
      },
      {
        nome: "Pizza Bella",
        descricao: "Pizzas no forno a lenha",
        endereco: "Rua das Palmeiras, 88",
        telefone: "(41) 97777-2222",
        categoria: "Pizzaria",
        emoji: "🍕",
        tempo: "30-40 min",
        nota: 4.5,
        taxa: 7.5,
      },
      {
        nome: "Verde Vida",
        descricao: "Pratos vegetarianos e veganos",
        endereco: "Rua da Saúde, 210",
        telefone: "(41) 96666-3333",
        categoria: "Saudável",
        emoji: "🥗",
        tempo: "20-30 min",
        nota: 4.6,
        taxa: 5.9,
      },
      {
        nome: "Doce Encanto",
        descricao: "Bolos, doces e sobremesas",
        endereco: "Rua Açucarada, 45",
        telefone: "(41) 95555-4444",
        categoria: "Sobremesas",
        emoji: "🍰",
        tempo: "15-25 min",
        nota: 4.9,
        taxa: 4.5,
      },
    ],
  });

  console.log("Outros restaurantes criados:", outrosRestaurantes.count);

  // Produtos
  const produto1 = await prisma.produto.create({
    data: {
      nome: "X-Burger",
      descricao: "Hambúrguer com queijo",
      preco: 25.9,
      restauranteId: restaurante.id,
    },
  });

  const produto2 = await prisma.produto.create({
    data: {
      nome: "Batata Frita",
      descricao: "Porção média",
      preco: 15.5,
      restauranteId: restaurante.id,
    },
  });

  console.log("Produtos criados:", produto1, produto2);

  // Pedido
  const pedido = await prisma.pedido.create({
    data: {
      total: 41.4,
      usuarioId: cliente.id,
      restauranteId: restaurante.id,

      itens: {
        create: [
          {
            quantidade: 1,
            precoUni: 25.9,
            produtoId: produto1.id,
          },
          {
            quantidade: 1,
            precoUni: 15.5,
            produtoId: produto2.id,
          },
        ],
      },
    },
  });

  console.log("Pedido criado:", pedido);
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });