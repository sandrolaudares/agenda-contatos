#!/bin/bash

echo "🛰️ YOLO Satellite Detector - Development Setup"
echo "=============================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script a partir da raiz do projeto"
    exit 1
fi

# Verificar dependências do sistema
echo "🔍 Verificando dependências do sistema..."

# Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado"
    echo "📥 Instale Python 3.8+ de https://python.org"
    exit 1
fi
echo "✅ Python: $(python3 --version)"

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado"
    echo "📥 Instale Node.js 18+ de https://nodejs.org"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."

# Node.js dependencies
echo "🟦 Instalando dependências Node.js..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências Node.js"
    exit 1
fi

# Python dependencies
echo "🐍 Instalando dependências Python..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências Python"
    echo "💡 Tente: pip3 install --user -r requirements.txt"
    exit 1
fi

# Criar diretórios necessários
mkdir -p models
mkdir -p static/uploads

echo ""
echo "🎉 Setup de desenvolvimento concluído!"
echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo "   1. Terminal 1: npm run python:serve"
echo "   2. Terminal 2: npm run dev"
echo ""
echo "🌐 URLs do aplicativo:"
echo "   Frontend: http://localhost:5173"
echo "   API YOLO: http://localhost:5000"
echo ""
echo "📖 Comandos úteis:"
echo "   npm run build     - Build para produção"
echo "   npm run preview   - Preview do build"
echo "   npm run test      - Executar testes"
echo ""