# 🛵 Delivery API — TCC Backend

API REST para gerenciamento de delivery, construída com Node.js, TypeScript, Express, Prisma e SQLite.

---

## 📌 Sobre o projeto

| | |
|---|---|
| **Nome** | Delivery API |
| **Problema** | Facilitar o cadastro e a gestão de restaurantes, produtos e pedidos em um sistema de delivery |
| **Objetivo** | Prover uma API backend para operações de usuários, restaurantes, produtos e pedidos |
| **Público-alvo** | Desenvolvedores, avaliadores e aplicações de delivery (web/mobile) que consumam esta API |

> Este repositório contém **apenas o backend** do TCC. Não há frontend web, aplicativo mobile ou solução IoT incluídos neste código.

---

## 🚀 Tecnologias utilizadas

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **SQLite**
- **JWT** (JSON Web Tokens)
- **Swagger UI** (documentação interativa da API)
- **TSX** (execução TypeScript em desenvolvimento)
- **bcryptjs** (hash de senhas)
- **cors**
- **dotenv**

---

## 🏗️ Arquitetura

A aplicação segue uma arquitetura em camadas:

```
cliente HTTP → Express → rota → controller → Prisma → banco de dados
```

| Camada | Responsabilidade |
|---|---|
| `src/index.ts` | Inicializa o servidor HTTP |
| `src/app.ts` | Configura o Express, parser JSON, CORS e rotas |
| `src/routes.ts` | Define os endpoints disponíveis |
| `src/controllers/*` | Contém a lógica de cada recurso (usuários, restaurantes, produtos, pedidos) |
| `src/middlewares/authentication.ts` | Middleware de autenticação JWT |
| `config/prisma.ts` | Inicializa o cliente Prisma |
| `prisma/schema.prisma` | Modelo do banco de dados |
| `prisma/seed.ts` | Popula dados iniciais para desenvolvimento |

---

## 📁 Estrutura do projeto

```
BackEndDelivery-TCC/
├── config/
│   ├── prisma.ts
│   └── swaggerConfig.ts
├── generated/
│   └── prisma/          # Prisma Client gerado
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

---

## ⚙️ Como executar

**1. Instale as dependências**

```bash
npm install
```

**2. Configure o `.env`** na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_troque_em_producao"
PORT=8080
```

**3. Crie o banco e aplique as migrations**

```bash
npm run db:migrate
```

**4. Popule dados iniciais (opcional, mas recomendado)**

```bash
npm run db:seed
```

**5. Inicie a aplicação**

```bash
npm start
```

Em desenvolvimento, use:

```bash
npm run dev
```

**6. Acesse a documentação Swagger**

```
http://localhost:3000/docs
```

---

## 🔐 Autenticação

A API oferece login com JWT. O token é gerado ao autenticar o usuário e deve ser enviado nas rotas que exigem autorização.

```http
Authorization: Bearer <token>
```

> O middleware de autenticação está implementado em `src/middlewares/authentication.ts`.

---

## 📡 Endpoints disponíveis

### Usuários

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|:---:|
| POST | `/usuarios/registrar` | Registrar novo usuário | não |
| POST | `/usuarios/login` | Fazer login e receber token | não |
| GET | `/usuarios` | Listar usuários | não |
| GET | `/usuarios/:id` | Buscar usuário por ID | não |
| PUT | `/usuarios/:id` | Atualizar usuário | não |
| DELETE | `/usuarios/:id` | Deletar usuário | não |

**Registro**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "role": "cliente"
}
```

**Login**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### Restaurantes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/restaurantes` | Listar todos os restaurantes |
| GET | `/restaurantes/:id` | Buscar restaurante por ID |
| POST | `/restaurantes` | Criar restaurante |
| PUT | `/restaurantes/:id` | Atualizar restaurante |
| DELETE | `/restaurantes/:id` | Deletar restaurante |

**Criação**
```json
{
  "nome": "Burger House",
  "descricao": "Hambúrguer artesanal",
  "endereco": "Rua Central, 123",
  "telefone": "(41) 99999-9999"
}
```

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos/restaurante/:restauranteId` | Listar produtos por restaurante |
| GET | `/produtos/:id` | Buscar produto por ID |
| POST | `/produtos` | Criar produto |
| PUT | `/produtos/:id` | Atualizar produto |
| DELETE | `/produtos/:id` | Deletar produto |

**Criação**
```json
{
  "nome": "X-Burger",
  "descricao": "Hambúrguer com queijo",
  "preco": 25.90,
  "restauranteId": 1
}
```

### Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pedidos` | Listar todos os pedidos |
| GET | `/pedidos/meus` | Listar pedidos do usuário atual |
| GET | `/pedidos/:id` | Buscar pedido por ID |
| POST | `/pedidos` | Criar novo pedido |
| PATCH | `/pedidos/:id/status` | Atualizar status do pedido |
| DELETE | `/pedidos/:id` | Deletar pedido |

**Criação**
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

**Atualização de status**
```json
{
  "status": "confirmado"
}
```

Status válidos: `pendente` · `confirmado` · `em_preparo` · `saiu_entrega` · `entregue` · `cancelado`

---

## 🗄️ Banco de dados

**ORM:** Prisma · **Banco:** SQLite (`prisma/schema.prisma` define o modelo completo)

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

---

## 🛠️ Scripts úteis

| Script | Descrição |
|---|---|
| `npm install` | Instala as dependências |
| `npm start` | Inicia a aplicação em produção |
| `npm run dev` | Inicia a aplicação em modo desenvolvimento |
| `npm run db:migrate` | Cria/atualiza o banco com as migrations |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:studio` | Abre o Prisma Studio (interface visual do banco) |
| `npm run db:seed` | Popula o banco com dados iniciais |

---

## 📌 Observações

- Este repositório contém apenas o **backend** do TCC.
- A documentação interativa da API também está disponível via Swagger em `/docs`.
