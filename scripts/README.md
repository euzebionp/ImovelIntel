# Scripts de Deploy

Este diretório contém scripts para automatizar o processo de deploy da aplicação ImovelIntel.

## 📜 Scripts Disponíveis

### `deploy.sh` (Linux/Mac/Git Bash)
Script bash para ambientes Unix-like e Git Bash no Windows.

**Uso:**
```bash
npm run deploy
```

### `deploy.bat` (Windows)
Script batch nativo para Windows (CMD/PowerShell).

**Uso:**
```bash
npm run deploy:win
```

## 🚀 O que os Scripts Fazem

1. **Build do Frontend**: Compila a aplicação React (apps/web)
2. **Verificação**: Checa se há mudanças no build
3. **Git Add**: Adiciona os arquivos do build ao staging
4. **Commit**: Cria um commit com timestamp
5. **Push**: Envia para o GitHub (branch main)
6. **Deploy Automático**: O cPanel detecta o push e faz deploy via `.cpanel.yml`

## ⚙️ Configuração

Os scripts estão prontos para uso. Certifique-se de que:
- ✅ Você tem permissões de push no repositório
- ✅ O Git está configurado com suas credenciais
- ✅ O arquivo `.cpanel.yml` está configurado corretamente

## 🔧 Troubleshooting

### Erro de Permissão (Linux/Mac)
```bash
chmod +x scripts/deploy.sh
```

### Build Falha
Verifique se todas as dependências estão instaladas:
```bash
npm run install:all
```

### Push Falha
Verifique suas credenciais Git:
```bash
git config --list
```
