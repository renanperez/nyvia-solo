# 🚀 Aplicação Completa - Backend + Frontend

Sistema funcional com backend Express e frontend React + TailwindCSS com menu lateral.

## 📋 O que tem aqui

- **Backend**: API REST em Node.js/Express na porta 3001
- **Frontend**: Interface React com tema bonito e menu lateral
- **Integração**: Frontend faz requisições reais para o backend

## 🏃 Como Rodar

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Iniciar o backend

```bash
npm start
```

Você verá: `🚀 Backend rodando em http://localhost:3001`

### 3. Abrir o frontend

Em outro terminal (ou simplesmente abra no navegador):

```bash
cd ../frontend
# Abra o arquivo index.html no navegador
# Ou use um servidor simples:
python -m http.server 8000
# Ou:
npx serve .
```

Acesse: http://localhost:8000

## ✅ Funcionalidades

### Backend (server.js)
- GET `/api/produtos` - Lista produtos
- POST `/api/produtos` - Cria novo produto
- CORS habilitado para aceitar requisições do frontend

### Frontend (index.html)
- Menu lateral retrátil
- 4 páginas: Dashboard, Produtos, Usuários, Configurações
- Busca produtos do backend em tempo real
- Formulário para criar novos produtos
- Interface totalmente responsiva com TailwindCSS

## 🎯 Testando a Integração

1. Abra o frontend no navegador
2. Clique em "Produtos" no menu lateral
3. Você verá a lista de produtos vindo do backend
4. Preencha o formulário e clique em "Criar"
5. O novo produto é enviado para o backend via POST

## 🔧 Estrutura

```
.
├── backend/
│   ├── server.js       # Servidor Express
│   └── package.json    # Dependências
└── frontend/
    └── index.html      # App React completo (single file)
```

## 💡 Próximos Passos

- Adicionar banco de dados (SQLite, PostgreSQL, MongoDB)
- Autenticação com JWT
- Separar frontend em componentes individuais
- Adicionar validações no backend
- Deploy (Vercel, Railway, Render)

---

**Pronto!** Sistema completamente funcional em 3 arquivos.
# nyvia-solo
