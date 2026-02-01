@echo off
REM Script de Deploy Automatizado - ImovelIntel (Windows)
REM Este script faz build, commit e push para produção

echo.
echo ========================================
echo   DEPLOY AUTOMATICO - IMOVELINTEL
echo ========================================
echo.

REM 1. Build do Frontend
echo [1/5] Fazendo build do frontend...
cd apps\web
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Build falhou!
    cd ..\..
    exit /b 1
)
cd ..\..
echo ✓ Build concluido!
echo.

REM 2. Verificar se há mudanças
echo [2/5] Verificando mudancas...
git diff --quiet apps/web/dist/
if %errorlevel% equ 0 (
    echo ⚠ Nenhuma mudanca detectada no build.
    echo   O deploy nao e necessario.
    exit /b 0
)

REM 3. Adicionar arquivos ao Git
echo [3/5] Adicionando arquivos ao Git...
git add apps/web/dist/
echo ✓ Arquivos adicionados!
echo.

REM 4. Commit
echo [4/5] Criando commit...
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set COMMIT_MSG=Deploy automatico - %mydate% %mytime%
git commit -m "%COMMIT_MSG%"
echo ✓ Commit criado!
echo.

REM 5. Push para GitHub
echo [5/5] Enviando para GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERRO: Push falhou!
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo O cPanel ira processar as mudancas em alguns minutos.
echo Acesse: www.imovelintel.online
echo.
pause
