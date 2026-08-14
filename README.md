# 🛵 Delivery API — TCC Backend

API REST para gerenciamento de delivery com Node.js, TypeScript, Express, Prisma e SQLite.

## 📌 Introdução

Este repositório contém o backend do sistema de delivery para TCC.

- Nome do projeto: **Delivery API**
- Problema: facilitar o cadastro de restaurantes, produtos e pedidos em um sistema de delivery simples
- Objetivo: prover uma API backend para operações de usuários, restaurantes, produtos e pedidos
- Público-alvo: desenvolvedores, avaliadores e usuários de aplicativos de delivery

## 🚀 Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite
- JWT (JSON Web Tokens)
- Swagger UI
- TSX
- bcryptjs
- cors
- dotenv

## 🏗️ Arquitetura do sistema

A aplicação segue uma arquitetura em camadas simples:

- `src/index.ts`: inicializa o servidor HTTP
- `src/app.ts`: configura o Express, o parser JSON, CORS e as rotas
- `src/routes.ts`: define os endpoints disponíveis
- `src/controllers/*`: contém a lógica de cada recurso
- `src/middlewares/authentication.ts`: middleware de autenticação JWT
- `config/prisma.ts`: inicializa o cliente Prisma
- `prisma/schema.prisma`: modelo do banco de dados
- `prisma/seed.ts`: dados iniciais para desenvolvimento

O fluxo de dados é:

cliente HTTP → Express → rota → controller → Prisma → banco de dados

## 📁 Estrutura do projeto

```
BackEndDelivery-TCC/
├── config/
│   ├── prisma.ts
│   └── swaggerConfig.ts
├── generated/
│   └── prisma/      # Prisma Client gerado
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── controllers/
│   │   ├── pedidos.ts
│   │   ├── produtos.ts
│   │   ├── restaurantes.ts
│   │   └── usuarios.ts
│   ├── middlewares/
│   │   └── authentication.ts
│   └── routes.ts
├── package.json
├── prisma.config.ts
└── README.md
```

## ⚙️ Como executar

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` na raiz com as variáveis abaixo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_troque_em_producao"
PORT=8080
```

3. Crie o banco e aplique as migrations:

```bash
npm run db:migrate
```

4. Execute o seed para popular dados iniciais:

```bash
npm run db:seed
```

5. Inicie a aplicação:

```bash
npm start
```

6. Em desenvolvimento, use:

```bash
npm run dev
```

7. Abra a documentação Swagger em:

```text
http://localhost:8080/docs
```

## 🔐 Autenticação

A API possui suporte a login com JWT. O token é gerado ao autenticar o usuário e pode ser usado nas rotas que exigem autorização.

Header de exemplo:

```http
Authorization: Bearer <token>
```

> Observação: o middleware de autenticação está implementado em `src/middlewares/authentication.ts`.

## 📡 Endpoints disponíveis

### Usuários

| Método | Rota                    | Descrição                    | Autenticação |
|--------|-------------------------|------------------------------|--------------|
| POST   | /usuarios/registrar     | Registrar novo usuário       | não          |
| POST   | /usuarios/login         | Fazer login e receber token  | não          |
| GET    | /usuarios               | Listar usuários              | não          |
| GET    | /usuarios/:id           | Buscar usuário por ID        | não          |
| PUT    | /usuarios/:id           | Atualizar usuário            | não          |
| DELETE | /usuarios/:id           | Deletar usuário              | não          |

#### Exemplo de body para registro

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "role": "cliente"
}
```

#### Exemplo de body para login

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### Restaurantes

| Método | Rota                    | Descrição                    |
|--------|-------------------------|------------------------------|
| GET    | /restaurantes           | Listar todos os restaurantes |
| GET    | /restaurantes/:id       | Buscar restaurante por ID     |
| POST   | /restaurantes           | Criar restaurante             |
| PUT    | /restaurantes/:id       | Atualizar restaurante         |
| DELETE | /restaurantes/:id       | Deletar restaurante           |

#### Exemplo de body para criação de restaurante

```json
{
  "nome": "Burger House",
  "descricao": "Hambúrguer artesanal",
  "endereco": "Rua Central, 123",
  "telefone": "(41) 99999-9999"
}
```

### Produtos

| Método | Rota                                   | Descrição                    |
|--------|----------------------------------------|------------------------------|
| GET    | /produtos/restaurante/:restauranteId   | Listar produtos por restaurante |
| GET    | /produtos/:id                          | Buscar produto por ID        |
| POST   | /produtos                              | Criar produto                |
| PUT    | /produtos/:id                          | Atualizar produto            |
| DELETE | /produtos/:id                          | Deletar produto              |

#### Exemplo de body para criação de produto

```json
{
  "nome": "X-Burger",
  "descricao": "Hambúrguer com queijo",
  "preco": 25.90,
  "restauranteId": 1
}
```

### Pedidos

| Método | Rota                     | Descrição                          |
|--------|--------------------------|------------------------------------|
| GET    | /pedidos                 | Listar todos os pedidos            |
| GET    | /pedidos/meus            | Listar pedidos do usuário atual    |
| GET    | /pedidos/:id             | Buscar pedido por ID               |
| POST   | /pedidos                 | Criar novo pedido                  |
| PATCH  | /pedidos/:id/status      | Atualizar status do pedido         |
| DELETE | /pedidos/:id             | Deletar pedido                     |

#### Exemplo de body para criação de pedido

```json
{
  "restauranteId": 1,
  "observacao": "Sem cebola, por favor",
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 2, "quantidade": 1 }
  ]
}
```

#### Exemplo de body para atualizar status

```json
{
  "status": "confirmado"
}
```

Status válidos:

- `pendente`
- `confirmado`
- `em_preparo`
- `saiu_entrega`
- `entregue`
- `cancelado`

## 🗄️ Banco de dados

### Tabelas / modelos

- `Usuario`
- `Restaurante`
- `Produto`
- `Pedido`
- `ItemPedido`

### Relacionamentos

- Um `Usuario` pode ter muitos `Pedido`
- Um `Restaurante` pode ter muitos `Produto`
- Um `Restaurante` pode ter muitos `Pedido`
- Um `Pedido` tem muitos `ItemPedido`
- Um `ItemPedido` pertence a um `Produto`

### Modelo ER simplificado

```text
Usuario 1 ── * Pedido * ── 1 Restaurante
                 |
                 *
                 ItemPedido * ── 1 Produto
``` 

## 📌 Observações do projeto

- Este repositório contém o backend do TCC.
- Não há frontend web, aplicativo mobile ou solução IoT incluídos neste código.
- A documentação de API também é exposta via Swagger em `/docs`.

## 🛠️ Scripts úteis

```bash
npm install
npm start
npm run dev
npm run db:migrate
npm run db:generate
npm run db:studio
npm run db:seed
```
