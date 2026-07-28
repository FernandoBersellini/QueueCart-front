# QueueCart — Guia de Integração para o Frontend

> Documento de contexto para a sessão que vai desenvolver o frontend (Next.js). Descreve o
> estado atual do backend, os endpoints disponíveis e como se comunicar com eles. Reflete o
> código como está hoje (Fase 1 — Núcleo, em andamento) — vai ficar desatualizado à medida que
> o backend evoluir, então em caso de dúvida confira o código-fonte do backend.
>
> **Abordagem de colaboração**: este projeto é de aprendizado (ver `CLAUDE.md`, seção "Abordagem
> de colaboração (educativa)"). Para decisões de implementação no frontend — não para dúvidas
> triviais ou boilerplate já decidido — prefira apontar direção (conceitos, trade-offs, onde a
> mudança provavelmente entra) em vez de entregar a solução pronta de cara. Deixe o
> desenvolvedor propor a abordagem primeiro.

## 1. Sobre o projeto

E-commerce fictício, projeto pessoal de portfólio cujo objetivo é aprender tecnologias novas
com profundidade (o foco principal é RabbitMQ/mensageria, na Fase 2). O backend é um monólito
modular em Spring Boot organizado por domínio: `catalog` (product + category), `cart`, `order`,
`inventory`, `notification`, `user`. O frontend consome tudo via API REST/JSON.

Fase atual (Fase 1): modelagem de domínio, API REST de catálogo/carrinho/pedido, JWT, e o
frontend Next.js consumindo essa API. Ainda **não há** integração de mensageria (RabbitMQ)
visível para o frontend — o fluxo `order.created → inventory/notification` roda inteiramente no
backend.

## 2. Como rodar / onde a API vive

- Base URL local: `http://localhost:8080` (porta padrão do Spring Boot, nenhuma
  `server.port`/`context-path` customizada em `application.properties`).
- Formato: JSON em todo lugar, sem envelope — os controllers retornam o DTO diretamente (não há
  `{ data: ... }` nem paginação implementada ainda).
- **CORS configurado apenas para `http://localhost:3001`** (`SecurityConfig.corsConfigurationSource()`).
  Métodos liberados: `GET, POST, PUT, PATCH, DELETE, OPTIONS`, qualquer header, e
  `allowCredentials(true)`. Se o frontend rodar em outra porta/origem, o backend precisa adicionar
  essa origem na lista — não é um wildcard `*`.

## 3. Autenticação (JWT)

Rotas em `/user/auth/*`:

| Método | Rota | Body | Retorno |
|---|---|---|---|
| POST | `/user/auth/sign-up` | `{ email, password, name }` | `201` + `AuthResponseDTO` |
| POST | `/user/auth/sign-in` | `{ email, password }` | `200` + `AuthResponseDTO` |
| POST | `/user/auth/logout` | — (token vai no header) | `204` |

`AuthResponseDTO`:
```json
{ "userId": 1, "email": "user@mail.com", "name": "User", "role": "CUSTOMER", "token": "<jwt>" }
```
O campo `role` (`CUSTOMER` ou `ADMIN`) foi adicionado à resposta — o frontend precisa dele para
decidir o que renderizar (ex.: esconder telas de admin) sem depender de decodificar o JWT.

⚠️ **O campo `token` no corpo da resposta é temporário.** Há um comentário explícito no código
(`AuthResponseDTO.java`) dizendo que ele será removido antes do deploy, e que o token vai passar
a ser entregue via cookie. **Não construa a lógica de auth do frontend assumindo que
`token` no body é definitivo** — trate como implementação provisória da Fase 1.

**Como autenticar chamadas**: enviar o JWT no header `Authorization: Bearer <token>` em toda
requisição que precisar de identidade do usuário. O filtro (`JwtAuthenticationFilter`) lê esse
header, valida o token e popula o contexto de segurança com `email` (subject) e a authority
`ROLE_<role>` (`ROLE_CUSTOMER` ou `ROLE_ADMIN`).

**Autorização por rota agora está ativa** (`SecurityConfig` não usa mais
`anyRequest().permitAll()`). Regras atuais:

| Rota | Regra |
|---|---|
| `POST /user/auth/sign-in`, `POST /user/auth/sign-up` | pública |
| `GET /product/all-products`, `GET /product/product/**` | pública |
| `GET /category/all-categories`, `GET /category/category/**` | pública |
| `POST /product/create-product` | `ADMIN` |
| `PATCH /product/update-product/**`, `PATCH /product/toggle-product/**` | `ADMIN` |
| `DELETE /product/delete-product/**` | `ADMIN` |
| `POST /category/create-category` | `ADMIN` |
| `PATCH /category/update-category/**`, `PATCH /category/toggle-category/**` | `ADMIN` |
| `DELETE /category/delete-category/**` | `ADMIN` |
| `GET /order/all-orders` | `ADMIN` |
| `PATCH /order/order/*/confirm`, `/ship`, `/deliver` | `ADMIN` |
| `DELETE /order/delete-order/**` | `ADMIN` |
| `POST /product/product/*/images` | `ADMIN` |
| `DELETE /product/product/*/images/**` | `ADMIN` |
| qualquer outra rota (cart, `POST /order/create-order`, `GET /order/order/{id}`, `GET /order/order/user/{userId}`, `PATCH /order/order/*/cancel`, `POST /user/auth/logout`, etc.) | autenticado (qualquer usuário logado, sem exigir role específica) |

Ou seja: rotas de leitura de catálogo continuam públicas, rotas administrativas de escrita
exigem `ADMIN`, e o resto (carrinho, pedidos do próprio usuário) exige apenas estar logado — sem
verificação de que o `userId` da rota é o mesmo do token (isso ainda não existe; não modele o
frontend assumindo que um usuário `CUSTOMER` está impedido de acessar/alterar carrinho ou pedido
de outro `userId` pela API — a checagem de "dono do recurso" ainda não está implementada no
backend).

`SecurityConfig` não registra um `AuthenticationEntryPoint`/`AccessDeniedHandler` customizado nem
`httpBasic()`/`formLogin()` — nesse caso o comportamento padrão do Spring Security é responder
`403` tanto para requisição sem token quanto para token válido com role insuficiente (não há
`401` de "não autenticado" distinto de `403` de "sem permissão" hoje). `401` continua existindo
só para credenciais inválidas no `sign-in`. Trate `403` no frontend como "sem acesso" — pode
significar tanto "não logado" quanto "logado mas sem permissão"; se precisar diferenciar os dois
casos na UI, isso ainda depende de o frontend saber se guardou um token localmente ou não.

**Logout**: invalida o token via denylist server-side (usa o `jti` do JWT). Depois de logout,
requisições com aquele token voltam a ser tratadas como anônimas (o filtro ignora tokens
revogados, não lança erro).

**Erros de auth**: sign-in com credenciais inválidas ou usuário inativo → `401`. Sign-up com
email já existente → `409`. `SignUpDTO` agora valida `email` (formato), `password` (mínimo 8
caracteres) e `name` não-vazio via Bean Validation — erro de formato devolve `400` antes de
chegar na regra de negócio. Ver seção de formato de erro abaixo.

## 4. Endpoints por domínio

### Catálogo — Produtos (`/product/`)

| Método | Rota | Body | Retorno |
|---|---|---|---|
| GET | `/product/all-products` | — | `200` + `PageResponseDTO<ProductDTO>` |
| GET | `/product/product/{id}` | — | `200` + `ProductDTO` |
| GET | `/product/product/category/{categoryId}` | — | `200` + `PageResponseDTO<ProductDTO>` |
| POST | `/product/create-product` | `CreateProductDTO` | `ProductDTO` |
| PATCH | `/product/update-product/{id}` | `UpdateProductDTO` | `ProductDTO` |
| PATCH | `/product/toggle-product/{id}` | — | `ProductDTO` (ativa/desativa) |
| DELETE | `/product/delete-product/{id}` | — | `204` |
| POST | `/product/product/{id}/images` | `{ url }` | `201` + `ProductDTO` (`ADMIN`) |
| DELETE | `/product/product/{id}/images/{imageId}` | — | `200` + `ProductDTO` (`ADMIN`) |

Os dois GETs de lista aceitam `?page=0&size=20` (0-based, `size` default 20). Ordenação
padrão: `id` ascendente.

```ts
ProductDTO       { id, name, description, sku, price, active, categoryId, imageUrls: string[] }
CreateProductDTO { name, description, sku, price, categoryId }
UpdateProductDTO { name, description, sku, price, categoryId }
```
`price` é `BigDecimal` no backend → chega como número JSON; trate como string/decimal no
frontend se precisar de precisão monetária exata (evite `parseFloat` ingênuo em somas).

**Galeria de imagens**: um produto tem várias imagens (`imageUrls`), mas **sem ordem
explícita** — não há campo de posição/capa no backend, então não trate `imageUrls[0]` como
"imagem principal" garantida (é só a ordem de inserção/leitura do banco). `CreateProductDTO` e
`UpdateProductDTO` **não** incluem `imageUrls` — imagens só são adicionadas/removidas pelos
endpoints dedicados acima, uma de cada vez, e cada chamada devolve o `ProductDTO` inteiro já
atualizado (não um objeto de imagem isolado). `imageId` no `DELETE` é o `id` do `ProductImage`
no backend, que **não** é exposto em `imageUrls` (é só a lista de strings) — hoje o frontend não
tem como descobrir esse id pela API; se precisar apagar uma imagem específica, sinalize para o
backend expor o id junto da URL.

### Catálogo — Categorias (`/category/`)

| Método | Rota | Body | Retorno |
|---|---|---|---|
| GET | `/category/all-categories` | — | `CategoryDTO[]` |
| GET | `/category/category/{id}` | — | `CategoryDTO` |
| GET | `/category/category/parent/{parentId}` | — | `CategoryDTO[]` |
| POST | `/category/create-category` | `CreateCategoryDTO` | `CategoryDTO` |
| PATCH | `/category/update-category/{id}` | `UpdateCategoryDTO` | `CategoryDTO` |
| PATCH | `/category/toggle-category/{id}` | — | `CategoryDTO` |
| DELETE | `/category/delete-category/{id}` | — | `204` |

Sem paginação aqui — os dois GETs de lista trazem tudo (diferente de produto, que é
paginado).

```ts
CategoryDTO       { id, name, slug, description, active, parentId }
CreateCategoryDTO { name, slug, description, parentId }
UpdateCategoryDTO { name, slug, description, parentId }
```
Categorias suportam hierarquia (`parentId` opcional/nullable) — útil para árvore de menu no
frontend. `CreateCategoryDTO`/`UpdateCategoryDTO` agora exigem `name`/`slug`/`description`
não-vazios e `parentId` **não-nulo** via Bean Validation — se a categoria for raiz (sem pai),
confirme com o backend o que enviar em `parentId`, porque hoje `@NotNull` bloqueia `null` mesmo
sendo semanticamente "sem pai".

### Carrinho (`/cart/`)

Modelo atual: **um carrinho por `userId`**, sem endpoint de "get or create" separado — o GET já
cria o carrinho se não existir.

| Método | Rota | Body | Retorno |
|---|---|---|---|
| GET | `/cart/{userId}` | — | `CartDTO` |
| POST | `/cart/add-item/{userId}` | `{ productId, quantity }` | `CartDTO` |
| PATCH | `/cart/update-item/{userId}/{productId}` | `{ quantity }` | `CartDTO` |
| DELETE | `/cart/remove-item/{userId}/{productId}` | — | `CartDTO` |
| DELETE | `/cart/clear-cart/{userId}` | — | `CartDTO` |

```ts
CartDTO     { id, userId, items: CartItemDTO[] }
CartItemDTO { productId, quantity }
```
Repare que `CartItemDTO` só tem `productId` e `quantity` — **não** traz nome/preço do produto.
O frontend precisa cruzar com os dados de `/product/product/{id}` (ou manter um cache local dos
produtos) para montar a UI do carrinho com preço/nome.

`quantity` agora precisa ser positivo (`@Positive`) em `add-item` e `update-item` — enviar `0`
ou negativo devolve `400` (ver formato de erro). Não existe endpoint separado pra "zerar
quantidade removendo o item"; pra isso use `DELETE /cart/remove-item/{userId}/{productId}`.

### Pedidos (`/order/`)

| Método | Rota | Body | Retorno |
|---|---|---|---|
| POST | `/order/create-order` | `CreateOrderDTO` | `201` + `OrderDTO` |
| GET | `/order/all-orders` | — | `PageResponseDTO<OrderDTO>` |
| GET | `/order/order/{id}` | — | `OrderDTO` |
| GET | `/order/order/user/{userId}` | — | `PageResponseDTO<OrderDTO>` |
| PATCH | `/order/order/{id}/confirm` | — | `OrderDTO` |
| PATCH | `/order/order/{id}/ship` | — | `OrderDTO` |
| PATCH | `/order/order/{id}/deliver` | — | `OrderDTO` |
| PATCH | `/order/order/{id}/cancel` | — | `OrderDTO` |
| DELETE | `/order/delete-order/{id}` | — | `204` |

```ts
CreateOrderDTO     { userId, items: OrderItemRequestDTO[] }
OrderItemRequestDTO{ productId, productName, unitPrice, quantity }
OrderDTO           { id, userId, status, items: OrderItemDTO[], totalAmount, createdAt, updatedAt }
OrderItemDTO       { productId, productName, unitPrice, quantity, subtotal }
OrderStatus        "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
```

`?page=0&size=20` também aqui, mas ordenado por `createdAt` **descendente** (pedido mais recente
primeiro) — diferente do default de produto/categoria, é o que faz sentido para uma lista de
pedidos.

Ponto importante: **quem monta `CreateOrderDTO` é o cliente** — o frontend precisa enviar
`productName` e `unitPrice` junto com `productId`/`quantity` ao criar o pedido (o backend não
busca esses dados do catálogo automaticamente nesse endpoint). Isso normalmente vem do que já
está no carrinho na tela de checkout.

`CreateOrderDTO` agora valida `userId` não-nulo e `items` não-vazio; cada `OrderItemRequestDTO`
exige `productId`, `productName` não-vazio, `unitPrice > 0` e `quantity` positivo — mandar um
pedido sem itens ou com preço/quantidade inválidos devolve `400` antes de qualquer regra de
negócio rodar.

As transições de status (`confirm`, `ship`, `deliver`, `cancel`) hoje são chamadas diretas — não
há validação de máquina de estado exposta na doc, então trate erros de transição inválida como
possíveis (ver formato de erro abaixo) e não assuma que toda transição é sempre permitida.

## 5. Paginação

Só **produtos** e **pedidos** são paginados — **categorias não** (decisão deliberada: a lista de
categorias tende a ser pequena e hierárquica, não valia a pena o overhead). Onde existe,
paginação usa query params `page` (0-based, default `0`) e `size` (default `20`, sem limite
máximo configurado ainda — não envie `size` absurdo). O envelope de resposta é sempre o mesmo
formato, `PageResponseDTO<T>`:

```json
{
  "content": [ /* array de ProductDTO | OrderDTO */ ],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3,
  "last": false
}
```

Não há ordenação customizável pelo cliente (sem parâmetro `sort` exposto) — cada lista paginada
tem uma ordenação fixa no backend (produtos por `id` ascendente, pedidos por `createdAt`
descendente). As listas de categoria continuam devolvendo o array puro, sem envelope.

## 6. Formato de erro (padrão em toda a API)

Todo erro (validação, regra de negócio, exceção genérica) devolve o mesmo formato via
`GlobalExceptionHandler`:

```json
{
  "message": "descrição do erro",
  "errorCode": "BAD_REQUEST",
  "timestamp": "2026-07-23T18:00:00Z"
}
```

- `errorCode` é o nome do `HttpStatus` (ex.: `NOT_FOUND`, `CONFLICT`, `UNAUTHORIZED`,
  `BAD_REQUEST`, `INTERNAL_SERVER_ERROR`), não um código de negócio customizado.
- Erros de validação de campo (`@Valid`) concatenam `campo: mensagem` separados por vírgula em
  `message` — não vem como array estruturado por campo, então não dá pra mapear erro→campo de
  forma limpa hoje; é só uma string para exibir ao usuário ou logar.
- `@Valid` agora está em **todos** os `@RequestBody` da API (catalog, cart, order, user), não só
  produto/categoria — qualquer DTO de entrada pode devolver `400` por violação de constraint
  antes de tocar na regra de negócio (ver notas de validação em cada seção de endpoint acima).

## 7. O que NÃO existe ainda (não modelar o frontend em cima disso)

- Autorização por rota já existe (ver seção 3), mas ainda **não há checagem de "dono do
  recurso"** — um `CUSTOMER` autenticado pode chamar `/cart/{userId}` ou `/order/order/user/{userId}`
  com o `userId` de outra pessoa e a API não bloqueia isso hoje. Não modele o frontend
  assumindo que a API impede um usuário de acessar dados de outro.
- CORS configurado só para `http://localhost:3001` (ver seção 2) — outra origem precisa ser
  adicionada no backend antes de funcionar.
- Sem refresh token — o JWT expira em 1h (`jwt.expiration-ms=3600000`) e não há endpoint de
  renovação; ao expirar, o usuário precisa fazer sign-in de novo.
- Sem WebSocket/SSE para status de pedido em tempo real — para saber se um pedido mudou de
  status (ex.: confirmado após o consumer de `inventory` decrementar estoque), o frontend
  precisa fazer polling do GET do pedido.
- Sem endpoint de "meu perfil" (`/user/me` ou similar) — os dados do usuário logado vêm apenas
  do que já foi retornado no sign-in/sign-up (`AuthResponseDTO`), decodifique o próprio JWT no
  frontend se precisar do `role` depois.

## 8. Convenções relevantes para o frontend

- Todo o código (incluindo nomes que aparecem em payloads) é em inglês — não espere campos em
  português em nenhum DTO.
- IDs são `Long` no backend → chegam como número no JSON.
- Datas (`createdAt`, `updatedAt`, `timestamp`) são `Instant` → chegam como string ISO-8601 UTC.
