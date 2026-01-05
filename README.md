# ImovelIntel - Plataforma de Inteligência Imobiliária

## Visão Geral
Plataforma SaaS para gestão e inteligência imobiliária, integrando CRM, busca de imóveis e automação.

## Estrutura do Projeto (Monorepo)
Este repositório contém três aplicações principais:

1.  **API (`apps/api`)**: Backend em NestJS + Prisma + SQLite.
    - Gerencia autenticação (JWT), usuários e dados do CRM.
    - **Funcionalidades**:
        - Controle de Acesso Baseado em Função (RBAC): Apenas ADMINs podem gerenciar configurações e excluir/editar clientes.
        - Endpoints protegidos para Leads e Pipeline.
2.  **Web (`apps/web`)**: Frontend em React + Vite + TailwindCSS.
    - Interface moderna e responsiva.
    - **Funcionalidades**:
        - Dashboard com estatísticas em tempo real.
        - **CRM de Clientes**: Listagem, Criação, Edição e Exclusão de Leads (Restrito a Admin).
        - **Área Administrativa**: Menu "Configurações" exclusivo para administradores cadastrarem novos usuários.
        - **Login**: Autenticação segura; redirecionamento para WhatsApp para novos interessados (Substituindo cadastro público).
3.  **Worker (`apps/worker`)**: Serviço Python para tarefas de inteligência.
    - Web scraping e enriquecimento de dados em segundo plano.

## Funcionalidades Recentes (v1.1)
- **Gestão de Clientes Avançada**:
    - Administradores agora podem **EDITAR** e **EXCLUIR** clientes diretamente da tabela.
    - Usuários comuns apenas visualizam a lista (modo leitura).
- **Segurança e Acesso**:
    - Menu "Configurações" oculto para usuários não-admin.
    - Rotas de API `PUT` e `DELETE` para clientes protegidas com `RolesGuard`.
- **Fluxo de Entrada**:
    - Remoção do auto-cadastro público.
    - Novos interessados são direcionados via WhatsApp para o consultor Euzébio Borges.
    - Cadastro de novos usuários é feito exclusivamente internamente por um Admin.

## Começando

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)
- Postgres/SQLite (configurado no `.env`)

### Rodando a Aplicação
Para rodar a aplicação completa, abra **3 terminais separados**:

#### 1. Iniciar o Backend (API)
```bash
npm run start:api
```
*Roda em: http://localhost:3000*

#### 2. Iniciar o Frontend (Web)
```bash
npm run start:web
```
*Roda em: http://localhost:5173*

#### 3. Iniciar o Worker de Inteligência
```bash
npm run start:worker
```
*Roda em: http://localhost:8000*

## Contato e Suporte
Para acesso ou dúvidas, entre em contato com o consultor **Euzébio Borges** via WhatsApp: (34) 99863-2929.
