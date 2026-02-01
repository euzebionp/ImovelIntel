#!/bin/bash

# Script de Deploy Automatizado - ImovelIntel
# Este script faz build, commit e push para produção

set -e  # Para execução se houver erro

echo "🚀 Iniciando processo de deploy..."
echo ""

# 1. Build do Frontend
echo "📦 Fazendo build do frontend..."
cd apps/web
npm run build
cd ../..
echo "✅ Build concluído!"
echo ""

# 2. Verificar se há mudanças
echo "🔍 Verificando mudanças..."
if git diff --quiet apps/web/dist/; then
    echo "⚠️  Nenhuma mudança detectada no build."
    echo "   O deploy não é necessário."
    exit 0
fi

# 3. Adicionar arquivos ao Git
echo "📝 Adicionando arquivos ao Git..."
git add apps/web/dist/

# 4. Commit
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="🚀 Deploy automático - $TIMESTAMP"
echo "💾 Criando commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 5. Push para GitHub
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "🌐 O cPanel irá processar as mudanças em alguns minutos."
echo "🔗 Acesse: www.imovelintel.online"
echo ""
