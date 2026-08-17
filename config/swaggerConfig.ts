const usuarioSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    nome: { type: "string" },
    email: { type: "string" },
    senha: { type: "string" },
    role: { type: "string", example: "cliente" },
    criadoEm: { type: "string", format: "date-time" },
  },
};

const restauranteSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    nome: { type: "string" },
    descricao: { type: "string" },
    endereco: { type: "string" },
    telefone: { type: "string" },
    criadoEm: { type: "string", format: "date-time" },
  },
};

const produtoSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    nome: { type: "string" },
    descricao: { type: "string" },
    preco: { type: "number" },
    disponivel: { type: "boolean" },
    restauranteId: { type: "integer" },
    criadoEm: { type: "string", format: "date-time" },
  },
};

const pedidoSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    status: { type: "string", example: "pendente" },
    total: { type: "number" },
    observacao: { type: "string" },
    usuarioId: { type: "integer" },
    restauranteId: { type: "integer" },
    criadoEm: { type: "string", format: "date-time" },
    atualizadoEm: { type: "string", format: "date-time" },
  },
};

const itemPedidoSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    quantidade: { type: "integer" },
    precoUni: { type: "number" },
    pedidoId: { type: "integer" },
    produtoId: { type: "integer" },
  },
};


const initialRoute = {
  get: {
    tags: ["Rota Inicial"],
    summary: "Checar funcionamento da API",
    responses: {
      200: {
        description: "Servidor online",
        content: {
          "application/json": {
            example: { success: true },
          },
        },
      },
    },
  },
};


const usuarioRoutesNoId = {
  get: {
    tags: ["Usuários"],
    summary: "Listar usuários",
    responses: {
      200: {
        description: "Lista de usuários",
        content: {
          "application/json": {
            schema: { type: "array", items: { $ref: "#/components/schemas/Usuario" } },
          },
        },
      },
    },
  },
};

const usuarioByIdRoute = {
  get: {
    tags: ["Usuários"],
    summary: "Buscar usuário por ID",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: {
        description: "Usuário encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Usuario" },
          },
        },
      },
      404: { description: "Usuário não encontrado" },
    },
  },
  put: {
    tags: ["Usuários"],
    summary: "Atualizar usuário",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: { nome: "Victor Atualizado", email: "victor@gmail.com" },
        },
      },
    },
    responses: {
      200: {
        description: "Usuário atualizado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Usuario" },
          },
        },
      },
      404: { description: "Usuário não encontrado" },
    },
  },
  delete: {
    tags: ["Usuários"],
    summary: "Excluir usuário",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: { description: "Usuário removido" },
      404: { description: "Usuário não encontrado" },
    },
  },
};

const usuarioLoginRoute = {
  post: {
    tags: ["Usuários"],
    summary: "Login",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: { email: "victor@gmail.com", senha: "123456" },
        },
      },
    },
    responses: {
      200: {
        description: "Login realizado",
        content: {
          "application/json": {
            example: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
      },
      401: { description: "Credenciais inválidas" },
    },
  },
};

const usuarioRegistrarRoute = {
  post: {
    tags: ["Usuários"],
    summary: "Registrar usuário",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: { nome: "Victor", email: "victor@gmail.com", senha: "123456" },
        },
      },
    },
    responses: {
      201: {
        description: "Usuário registrado com sucesso",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Usuario" },
          },
        },
      },
      400: { description: "Dados inválidos ou e-mail já cadastrado" },
    },
  },
};

const restauranteRoutesNoId = {
  get: {
    tags: ["Restaurantes"],
    summary: "Listar restaurantes",
    responses: {
      200: {
        description: "Lista de restaurantes",
        content: {
          "application/json": {
            schema: { type: "array", items: { $ref: "#/components/schemas/Restaurante" } },
          },
        },
      },
    },
  },
  post: {
    tags: ["Restaurantes"],
    summary: "Criar restaurante",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            nome: "Restaurante Bom Sabor",
            descricao: "Comida caseira com qualidade",
            endereco: "Rua das Flores, 123",
            telefone: "(41) 99999-0000",
          },
        },
      },
    },
    responses: {
      201: {
        description: "Restaurante criado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Restaurante" },
          },
        },
      },
    },
  },
};

const restauranteByIdRoute = {
  get: {
    tags: ["Restaurantes"],
    summary: "Buscar restaurante por ID",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: {
        description: "Restaurante encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Restaurante" },
          },
        },
      },
      404: { description: "Restaurante não encontrado" },
    },
  },
  put: {
    tags: ["Restaurantes"],
    summary: "Atualizar restaurante",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            nome: "Restaurante Atualizado",
            descricao: "Nova descrição",
            endereco: "Rua Nova, 456",
            telefone: "(41) 98888-0000",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Restaurante atualizado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Restaurante" },
          },
        },
      },
      404: { description: "Restaurante não encontrado" },
    },
  },
  delete: {
    tags: ["Restaurantes"],
    summary: "Excluir restaurante",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: { description: "Restaurante removido" },
      404: { description: "Restaurante não encontrado" },
    },
  },
};

const produtosByRestauranteRoute = {
  get: {
    tags: ["Produtos"],
    summary: "Listar produtos por restaurante",
    parameters: [
      { name: "restauranteId", in: "path", required: true, schema: { type: "integer" } },
    ],
    responses: {
      200: {
        description: "Lista de produtos do restaurante",
        content: {
          "application/json": {
            schema: { type: "array", items: { $ref: "#/components/schemas/Produto" } },
          },
        },
      },
      404: { description: "Restaurante não encontrado" },
    },
  },
};

const produtoRoutesNoId = {
  post: {
    tags: ["Produtos"],
    summary: "Criar produto",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            nome: "X-Burguer",
            descricao: "Hambúrguer artesanal",
            preco: 29.9,
            disponivel: true,
            restauranteId: 1,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Produto criado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Produto" },
          },
        },
      },
    },
  },
};

const produtoByIdRoute = {
  get: {
    tags: ["Produtos"],
    summary: "Buscar produto por ID",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: {
        description: "Produto encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Produto" },
          },
        },
      },
      404: { description: "Produto não encontrado" },
    },
  },
  put: {
    tags: ["Produtos"],
    summary: "Atualizar produto",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            nome: "X-Burguer Especial",
            descricao: "Hambúrguer artesanal com queijo extra",
            preco: 34.9,
            disponivel: true,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Produto atualizado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Produto" },
          },
        },
      },
      404: { description: "Produto não encontrado" },
    },
  },
  delete: {
    tags: ["Produtos"],
    summary: "Excluir produto",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: { description: "Produto removido" },
      404: { description: "Produto não encontrado" },
    },
  },
};


const pedidoRoutesNoId = {
  get: {
    tags: ["Pedidos"],
    summary: "Listar todos os pedidos",
    responses: {
      200: {
        description: "Lista de pedidos",
        content: {
          "application/json": {
            schema: { type: "array", items: { $ref: "#/components/schemas/Pedido" } },
          },
        },
      },
    },
  },
  post: {
    tags: ["Pedidos"],
    summary: "Criar pedido",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            restauranteId: 1,
            observacao: "Sem cebola",
            itens: [
              { produtoId: 1, quantidade: 2 },
              { produtoId: 3, quantidade: 1 },
            ],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Pedido criado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Pedido" },
          },
        },
      },
      400: { description: "Dados inválidos" },
    },
  },
};

const pedidosMeusRoute = {
  get: {
    tags: ["Pedidos"],
    summary: "Listar pedidos do usuário autenticado",
    responses: {
      200: {
        description: "Lista de pedidos do usuário",
        content: {
          "application/json": {
            schema: { type: "array", items: { $ref: "#/components/schemas/Pedido" } },
          },
        },
      },
    },
  },
};

const pedidoByIdRoute = {
  get: {
    tags: ["Pedidos"],
    summary: "Buscar pedido por ID",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: {
        description: "Pedido encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Pedido" },
          },
        },
      },
      404: { description: "Pedido não encontrado" },
    },
  },
  delete: {
    tags: ["Pedidos"],
    summary: "Excluir pedido",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: {
      200: { description: "Pedido removido" },
      404: { description: "Pedido não encontrado" },
    },
  },
};

const pedidoStatusRoute = {
  patch: {
    tags: ["Pedidos"],
    summary: "Atualizar status do pedido",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          example: {
            status: "confirmado", // "pendente" | "confirmado" | "em_preparo" | "saiu_para_entrega" | "entregue" | "cancelado"
          },
        },
      },
    },
    responses: {
      200: {
        description: "Status atualizado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Pedido" },
          },
        },
      },
      400: { description: "Status inválido" },
      404: { description: "Pedido não encontrado" },
    },
  },
};

export default {
  initialRoute,

  // Schemas
  usuarioSchema,
  restauranteSchema,
  produtoSchema,
  pedidoSchema,
  itemPedidoSchema,

  // Usuários
  usuarioRoutesNoId,
  usuarioByIdRoute,
  usuarioLoginRoute,
  usuarioRegistrarRoute,

  // Restaurantes
  restauranteRoutesNoId,
  restauranteByIdRoute,

  // Produtos
  produtosByRestauranteRoute,
  produtoRoutesNoId,
  produtoByIdRoute,

  // Pedidos
  pedidoRoutesNoId,
  pedidosMeusRoute,
  pedidoByIdRoute,
  pedidoStatusRoute,
};