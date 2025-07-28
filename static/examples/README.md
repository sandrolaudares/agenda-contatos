# 📷 Imagens de Exemplo

Esta pasta contém imagens de exemplo para testar o detector YOLO.

## 🛰️ Fontes de Imagens de Satélite

Para testar o aplicativo, você pode usar imagens de satélite das seguintes fontes:

### Gratuitas
- **Google Earth**: Capture screenshots de áreas interessantes
- **NASA Earth Observatory**: [earthobservatory.nasa.gov](https://earthobservatory.nasa.gov)
- **USGS Earth Explorer**: [earthexplorer.usgs.gov](https://earthexplorer.usgs.gov)
- **Sentinel Hub**: [sentinel-hub.com](https://sentinel-hub.com)

### Datasets Públicos
- **SpaceNet**: [spacenet.ai](https://spacenet.ai)
- **xView Dataset**: [xviewdataset.org](http://xviewdataset.org)
- **DOTA Dataset**: [captain-whu.github.io/DOTA](https://captain-whu.github.io/DOTA)

## 🎯 Tipos de Objetos Detectáveis

O modelo YOLO foi treinado para detectar:

- **Veículos**: 🚗 carros, 🚛 caminhões, 🚌 ônibus
- **Pessoas**: 👥 indivíduos em espaços abertos
- **Animais**: 🐄 gado, 🐎 cavalos, 🐑 ovelhas
- **Aeronaves**: ✈️ aviões em aeroportos
- **Embarcações**: 🚢 barcos em portos e rios

## 📋 Dicas para Melhores Resultados

1. **Resolução**: Use imagens com pelo menos 640x640 pixels
2. **Qualidade**: Prefira imagens nítidas e bem iluminadas
3. **Objetos**: Objetos maiores são detectados com mais facilidade
4. **Contraste**: Boa diferenciação entre objetos e fundo
5. **Formato**: JPG, PNG ou WebP são suportados

## 🖼️ Exemplo de Comando para Download

```bash
# Baixar imagem de exemplo do USGS
wget "https://example.com/satellite-image.jpg" -O examples/satellite-sample.jpg
```

## 📝 Observações

- As imagens nesta pasta são apenas para demonstração
- Sempre respeite os direitos autorais das imagens
- Para uso comercial, verifique as licenças das fontes