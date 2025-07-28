#!/bin/bash

echo "🛰️ YOLO Satellite Detector - Iniciando aplicativo..."
echo "==================================================="

# Verificar se as dependências estão instaladas
if ! python3 -c "import ultralytics, flask, cv2" 2>/dev/null; then
    echo "❌ Dependências Python não encontradas. Execute:"
    echo "   pip3 install --break-system-packages -r requirements.txt"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "❌ Dependências Node.js não encontradas. Execute:"
    echo "   npm install"
    exit 1
fi

echo "✅ Dependências verificadas!"

# Criar pastas necessárias
mkdir -p static/uploads

# Iniciar servidor YOLO em background
echo "🚀 Iniciando servidor YOLO..."
python3 src/python/yolo_server.py &
YOLO_PID=$!

# Aguardar servidor YOLO inicializar
sleep 5

# Verificar se servidor YOLO está funcionando
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Servidor YOLO iniciado na porta 5000"
else
    echo "❌ Erro ao iniciar servidor YOLO"
    kill $YOLO_PID 2>/dev/null
    exit 1
fi

# Iniciar servidor SvelteKit
echo "🚀 Iniciando frontend SvelteKit..."
npm run dev &
SVELTE_PID=$!

# Aguardar servidor SvelteKit inicializar
sleep 10

# Verificar se servidor SvelteKit está funcionando
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend SvelteKit iniciado na porta 5173"
else
    echo "❌ Erro ao iniciar frontend SvelteKit"
    kill $YOLO_PID $SVELTE_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Aplicativo iniciado com sucesso!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🐍 API YOLO: http://localhost:5000"
echo ""
echo "Para parar o aplicativo, pressione Ctrl+C"

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando aplicativo..."
    kill $YOLO_PID $SVELTE_PID 2>/dev/null
    echo "✅ Aplicativo parado"
    exit 0
}

# Capturar sinais para limpeza
trap cleanup SIGINT SIGTERM

# Manter script ativo
wait