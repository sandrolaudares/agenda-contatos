#!/bin/bash

echo "🛰️ YOLO Satellite Detector - Setup"
echo "=================================="

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Instale Python 3.8+ primeiro."
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Verificar se pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não encontrado. Instale pip primeiro."
    exit 1
fi

echo "✅ pip encontrado: $(pip3 --version)"

# Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependências Python instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências Python"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências Node.js
echo "📦 Instalando dependências Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências Node.js instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências Node.js"
    exit 1
fi

# Criar diretório para modelos YOLO se não existir
mkdir -p models

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "Para iniciar o aplicativo:"
echo "1. Em um terminal: npm run python:serve"
echo "2. Em outro terminal: npm run dev"
echo ""
echo "O aplicativo estará disponível em:"
echo "- Frontend: http://localhost:5173"
echo "- API YOLO: http://localhost:5000"