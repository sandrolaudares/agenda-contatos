# 🛰️ YOLO Satellite Detector

Aplicativo web para detecção de objetos em imagens de satélite usando **YOLO (You Only Look Once)**, **SvelteKit** e **Python**.

Um aplicativo web moderno que utiliza inteligência artificial para identificar automaticamente objetos como veículos, pessoas, animais e estruturas em imagens de satélite de alta resolução.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=for-the-badge&logo=yolo&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Funcionalidades

- 🎯 **Detecção automática de objetos** usando modelo YOLOv8
- 📷 **Upload de imagens** com suporte a drag & drop
- 🖼️ **Preview em tempo real** das imagens carregadas
- 🔍 **Visualização de resultados** com bounding boxes coloridas
- 📊 **Estatísticas de detecção** com confiança e contagem
- 🌐 **Interface web responsiva** e moderna
- ⚡ **Processamento rápido** com PyTorch otimizado
- 🛰️ **Otimizado para imagens de satélite** com classes relevantes

## 🎯 Objetos Detectáveis

O sistema pode identificar 19 tipos de objetos relevantes para análise de imagens de satélite:

**Veículos & Transporte:**
- 🚗 Carros
- 🚌 Ônibus  
- 🚛 Caminhões
- 🏍️ Motocicletas
- ✈️ Aviões
- 🚂 Trens
- ⛵ Barcos

**Pessoas & Animais:**
- 👤 Pessoas
- 🐱 Gatos
- 🐶 Cachorros
- 🐴 Cavalos
- 🐑 Ovelhas
- 🐄 Vacas
- 🐘 Elefantes
- 🐻 Ursos
- 🦓 Zebras
- 🦒 Girafas

**Outros:**
- 🚲 Bicicletas
- 🦅 Pássaros

## 🔧 Tecnologias Utilizadas

### Frontend
- **SvelteKit** - Framework web moderno e reativo
- **TailwindCSS** - Estilização utilitária
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido

### Backend
- **Python 3.13** - Linguagem principal
- **Flask** - API web framework
- **Ultralytics YOLO** - Modelo de detecção de objetos
- **OpenCV** - Processamento de imagens
- **PyTorch** - Framework de machine learning
- **Pillow** - Manipulação de imagens

## 📋 Pré-requisitos

- **Python 3.8+** com pip
- **Node.js 18+** com npm
- **Mínimo 4GB RAM** (recomendado 8GB)
- **Conexão com internet** (para download do modelo YOLO)

## ⚡ Instalação Rápida

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd yolo-satellite-detector
```

### 2. Execute o script de configuração
```bash
# Linux/Mac
./scripts/dev-setup.sh

# Ou manualmente:
pip3 install --break-system-packages -r requirements.txt
npm install
```

### 3. Inicie o aplicativo
```bash
# Método mais fácil - script automático
./start-app.sh

# Ou manualmente em terminais separados:
# Terminal 1:
python3 src/python/yolo_server.py

# Terminal 2:
npm run dev
```

### 4. Acesse o aplicativo
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000

## 🖥️ Como Usar

1. **Abra o aplicativo** no navegador (http://localhost:5173)

2. **Carregue uma imagem:**
   - Clique na área de upload
   - Ou arraste e solte uma imagem
   - Formatos suportados: JPG, PNG, WEBP

3. **Visualize os resultados:**
   - A detecção é executada automaticamente
   - Objetos detectados aparecem com caixas coloridas
   - Estatísticas são mostradas na lateral

4. **Interprete os resultados:**
   - Cada cor representa um tipo de objeto
   - Números mostram a confiança da detecção (0-100%)
   - Lista lateral mostra todos os objetos encontrados

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia frontend em modo desenvolvimento
npm run build           # Constrói aplicação para produção
npm run preview         # Preview da build de produção
python3 test-setup.py    # Testa se dependências estão instaladas
```

### Produção
```bash
docker-compose up        # Inicia com Docker
./start-app.sh          # Script completo de inicialização
```

### Utilitários
```bash
npm run lint            # Verifica qualidade do código
npm run format          # Formata código automaticamente
chmod +x scripts/*.sh   # Torna scripts executáveis
```

## 🐳 Docker

### Desenvolvimento
```bash
docker-compose up
```

### Produção
```bash
docker-compose -f docker-compose.yml up --build
```

## 📁 Estrutura do Projeto

```
yolo-satellite-detector/
├── src/
│   ├── routes/           # Páginas SvelteKit
│   ├── python/          # Servidor YOLO
│   └── app.css         # Estilos globais
├── static/
│   └── examples/       # Imagens de exemplo
├── scripts/           # Scripts de configuração
├── requirements.txt   # Dependências Python
├── package.json      # Dependências Node.js
├── start-app.sh     # Script de inicialização
└── README.md        # Este arquivo
```

## 🔍 API Endpoints

### GET `/health`
Verifica status do servidor YOLO
```json
{
  "status": "ok",
  "model_loaded": true,
  "classes_available": 19,
  "message": "Servidor YOLO está funcionando"
}
```

### POST `/detect`
Detecta objetos em uma imagem
```bash
curl -X POST http://localhost:5000/detect \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data"}'
```

## 🎯 Exemplos de Uso

### Imagens Recomendadas
- **Google Earth screenshots**
- **Imagens de satélite de alta resolução**
- **Fotos aéreas de cidades**
- **Imagens de fazendas e campo**
- **Portos e aeroportos**

### Casos de Uso
- **Monitoramento urbano** - Contagem de veículos
- **Agricultura** - Identificação de animais
- **Segurança** - Detecção de pessoas e veículos
- **Pesquisa** - Análise de padrões de ocupação
- **Logística** - Monitoramento de frotas

## ⚠️ Limitações

- **Resolução mínima:** 416x416 pixels recomendado
- **Tamanho máximo:** 10MB por imagem
- **Formatos:** JPG, PNG, WEBP apenas
- **Processamento:** CPU apenas (GPU opcional)

## 🚨 Solução de Problemas

### Erro: Módulo não encontrado
```bash
pip3 install --break-system-packages -r requirements.txt
```

### Erro: Porta em uso
```bash
# Matar processos nas portas
sudo lsof -ti:5000 | xargs kill -9
sudo lsof -ti:5173 | xargs kill -9
```

### Erro: Modelo YOLO não carrega
```bash
# Limpar cache do YOLO
rm -rf ~/.cache/ultralytics/
python3 -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### Performance lenta
- Use imagens menores (< 2MB)
- Feche outros aplicativos
- Considere usar GPU com CUDA

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎉 Status do Projeto

✅ **FUNCIONANDO** - Aplicativo totalmente operacional!

- ✅ Backend Python com YOLO configurado
- ✅ Frontend SvelteKit responsivo  
- ✅ API de detecção funcionando
- ✅ Upload de imagens implementado
- ✅ Visualização de resultados
- ✅ Scripts de automação
- ✅ Documentação completa

**Próximas melhorias planejadas:**
- 🔄 Suporte a múltiplas imagens
- 📊 Relatórios em PDF
- 🎨 Temas personalizáveis
- 🌍 Integração com mapas
- 📱 App mobile
