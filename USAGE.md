# 📖 Guia de Uso - YOLO Satellite Detector

## 🚀 Início Rápido

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <repository-url>
cd yolo-satellite-detector

# Execute o setup automático
chmod +x scripts/setup-yolo.sh
./scripts/setup-yolo.sh
```

### 2. Iniciando o Aplicativo

**Opção 1: Script Automático (Recomendado)**
```bash
chmod +x start-app.sh
./start-app.sh
```

**Opção 2: Manual**
```bash
# Terminal 1 - Servidor Python YOLO
python3 src/python/yolo_server.py

# Terminal 2 - Frontend SvelteKit
npm run dev
```

### 3. Acessando a Aplicação

- **Frontend**: http://localhost:5173
- **API YOLO**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🎯 Como Usar

### Upload de Imagens

1. **Drag & Drop**: Arraste uma imagem diretamente para a área de upload
2. **Clique para Selecionar**: Clique na área de upload para abrir o seletor de arquivos
3. **Formatos Suportados**: JPG, PNG, WebP (máximo 10MB)

### Detecção de Objetos

1. Faça upload de uma imagem de satélite
2. Clique em "🎯 Detectar Objetos"
3. Aguarde o processamento (alguns segundos)
4. Visualize os resultados:
   - Imagem anotada com bounding boxes
   - Lista detalhada de objetos detectados
   - Estatísticas de confiança

### Exportando Resultados

- Clique em "Baixar Resultados (JSON)" para exportar:
  - Todas as detecções com coordenadas
  - Níveis de confiança
  - Estatísticas detalhadas
  - Timestamp do processamento

## 🛰️ Tipos de Objetos Detectados

O modelo YOLO pode identificar **19 categorias** de objetos:

### Veículos Terrestres
- 🚗 Carros
- 🚛 Caminhões  
- 🚌 Ônibus
- 🏍️ Motocicletas
- 🚲 Bicicletas
- 🚜 Tratores

### Transporte Aéreo/Marítimo
- ✈️ Aviões
- 🚁 Helicópteros
- ⛵ Barcos
- 🚢 Navios
- 🚂 Trens

### Pessoas e Animais
- 👤 Pessoas
- 🐕 Cães
- 🐈 Gatos
- 🐴 Cavalos
- 🐮 Gado
- 🐑 Ovelhas

### Estruturas
- 🏠 Edifícios
- 🌉 Pontes

## 📊 Interpretando os Resultados

### Níveis de Confiança

- **🟢 Alta (≥70%)**: Detecção muito confiável
- **🟡 Média (40-69%)**: Detecção provável
- **🔴 Baixa (<40%)**: Detecção incerta (filtrada por padrão)

### Coordenadas de Bounding Box

```json
{
  "bbox": {
    "x1": 100,  // Coordenada X superior esquerda
    "y1": 150,  // Coordenada Y superior esquerda  
    "x2": 200,  // Coordenada X inferior direita
    "y2": 250   // Coordenada Y inferior direita
  }
}
```

### Estatísticas

- **Objetos Detectados**: Total de objetos encontrados
- **Confiança Média**: Média percentual de todas as detecções
- **Alta Confiança**: Quantidade de detecções com ≥70% de certeza
- **Tempo de Processo**: Duração da análise em segundos

## 🖼️ Melhores Práticas para Imagens

### Qualidade Recomendada
- **Resolução**: Mínimo 640x640 pixels
- **Formato**: PNG ou JPG de alta qualidade
- **Tamanho**: Entre 1-10MB para melhor performance

### Tipos de Imagem Ideais
- ✅ Imagens de satélite com resolução média/alta
- ✅ Fotos aéreas com objetos visíveis
- ✅ Imagens com boa iluminação e contraste
- ❌ Imagens muito escuras ou com neblina
- ❌ Resolução muito baixa (<300x300)

### Fontes Recomendadas
- **Google Earth**: Screenshots de áreas urbanas/rurais
- **NASA Earth Observatory**: Imagens científicas
- **Sentinel Hub**: Dados de satélite abertos
- **SpaceNet**: Dataset público para treinamento

## 🔧 Configurações Avançadas

### Ajustar Limite de Confiança

Edite o arquivo `.env`:
```bash
# Reduzir para mais detecções (menos precisas)
YOLO_CONFIDENCE_THRESHOLD=0.2

# Aumentar para menos detecções (mais precisas)  
YOLO_CONFIDENCE_THRESHOLD=0.5
```

### Modelos YOLO Alternativos

No arquivo `src/python/yolo_server.py`, linha 23:
```python
# Modelo nano (rápido, menos preciso)
model = YOLO('yolov8n.pt')  

# Modelo small (balanceado)
model = YOLO('yolov8s.pt')

# Modelo medium (mais lento, mais preciso)
model = YOLO('yolov8m.pt')
```

## 🐛 Solução de Problemas

### Servidor YOLO Offline

```bash
# Verificar se Python está instalado
python3 --version

# Instalar dependências manualmente
pip3 install --break-system-packages -r requirements.txt

# Testar instalação
python3 test-setup.py

# Iniciar servidor manualmente
python3 src/python/yolo_server.py
```

### Frontend não Carrega

```bash
# Verificar Node.js
node --version

# Reinstalar dependências
rm -rf node_modules
npm install

# Iniciar em modo debug
npm run dev -- --host
```

### Problemas de Performance

1. **Use modelo nano** para velocidade: `yolov8n.pt`
2. **Reduza resolução** das imagens para <2MB
3. **Aumente RAM** disponível para Python
4. **Use SSD** para armazenamento mais rápido

### Erros Comuns

**"ModuleNotFoundError: No module named 'ultralytics'"**
```bash
pip3 install --break-system-packages ultralytics
```

**"CUDA out of memory"**
```bash
# Forçar uso de CPU
export CUDA_VISIBLE_DEVICES=""
python3 src/python/yolo_server.py
```

**"Failed to fetch"**
- Verificar se servidor YOLO está rodando (porta 5000)
- Verificar firewall/antivírus
- Testar: `curl http://localhost:5000/health`

## 📈 Limitações Conhecidas

- **Objetos pequenos**: Pode não detectar objetos muito pequenos na imagem
- **Sobreposição**: Objetos sobrepostos podem ser detectados como um só
- **Ângulo**: Funciona melhor com vistas aéreas diretas (90°)
- **Condições**: Performance reduzida com neblina, sombras ou baixa iluminação
- **Classes**: Limitado a 19 categorias predefinidas do COCO dataset

## 🚀 Próximos Passos

- [ ] Suporte a vídeos de satélite
- [ ] Treinamento com datasets específicos para satélite
- [ ] Integração com APIs de mapas (Google Earth, OpenStreetMap)
- [ ] Exportação para formatos GIS (GeoJSON, KML)
- [ ] Análise temporal de mudanças
- [ ] Detecção de desmatamento e urbanização