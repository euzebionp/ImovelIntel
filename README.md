# ImovelIntel - Plataforma de Inteligência Imobiliária

## Estrutura do Projeto
Este é um monorepo contendo três aplicações principais:

1.  **API (`apps/api`)**: O servidor backend (NestJS) que gerencia dados, usuários e lógica de CRM.
2.  **Web (`apps/web`)**: A interface frontend (React/Vite) onde os usuários interagem com o sistema.
3.  **Worker (`apps/worker`)**: Um serviço Python para tarefas de inteligência em segundo plano (web scraping, enriquecimento de dados).

## Começando

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)
- Postgres/SQLite (configurado no `.env`)

### Rodando a Aplicação
Para rodar a aplicação completa, você precisa abrir **3 terminais separados** e rodar um comando em cada um:

#### 1. Iniciar o Backend (API)
```bash
npm run start:api
```
*Roda em: http://localhost:3000 (ou porta definida no .env)*

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

## Solução de Problemas
- Se `npm run start:worker` falhar, certifique-se de que você tem o python instalado e as dependências configuradas:
  ```bash
  cd apps/worker
  pip install -r requirements.txt
  ```
- Se a API falhar ao conectar ao banco de dados, verifique seu arquivo `apps/api/.env`.
