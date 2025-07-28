#!/usr/bin/env python3
"""
Servidor Flask para detecção de objetos em imagens de satélite usando YOLO
"""

import os
import io
import base64
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from ultralytics import YOLO
import cv2

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('yolo_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permitir requisições cross-origin

# Variáveis globais
model = None
model_loaded = False

# Classes de objetos relevantes para imagens de satélite
SATELLITE_CLASSES = {
    0: 'pessoa',
    1: 'bicicleta', 
    2: 'carro',
    3: 'motocicleta',
    4: 'avião',
    5: 'ônibus',
    6: 'trem',
    7: 'caminhão',
    8: 'barco',
    14: 'pássaro',
    15: 'gato',
    16: 'cachorro',
    17: 'cavalo',
    18: 'ovelha',
    19: 'vaca',
    20: 'elefante',
    21: 'urso',
    22: 'zebra',
    23: 'girafa'
}

def load_yolo_model():
    """Carrega o modelo YOLO"""
    global model, model_loaded
    try:
        logger.info("Carregando modelo YOLO...")
        model = YOLO('yolov8n.pt')  # Modelo nano para rapidez
        model_loaded = True
        logger.info("Modelo YOLO carregado com sucesso!")
        return True
    except Exception as e:
        logger.error(f"Erro ao carregar modelo YOLO: {e}")
        model_loaded = False
        return False

def decode_base64_image(base64_string):
    """Decodifica imagem base64 para array numpy"""
    try:
        # Remover prefixo data:image se presente
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decodificar base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Converter para RGB se necessário
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        logger.info(f"Imagem decodificada: {image.size}, modo: {image.mode}")
        return np.array(image)
    except Exception as e:
        logger.error(f"Erro ao decodificar imagem: {e}")
        return None

def encode_image_to_base64(image_array):
    """Codifica array numpy para base64"""
    try:
        # Converter BGR para RGB se necessário
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
        
        # Converter para PIL Image
        image = Image.fromarray(image_array)
        
        # Converter para base64
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/jpeg;base64,{image_base64}"
    except Exception as e:
        logger.error(f"Erro ao codificar imagem: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se o servidor está funcionando"""
    status = {
        'status': 'ok' if model_loaded else 'model_not_loaded',
        'message': 'Servidor YOLO está funcionando' if model_loaded else 'Modelo YOLO não carregado',
        'model_loaded': model_loaded,
        'timestamp': datetime.now().isoformat(),
        'classes_available': len(SATELLITE_CLASSES)
    }
    return jsonify(status), 200 if model_loaded else 503

@app.route('/detect', methods=['POST'])
def detect_objects():
    """Endpoint principal para detecção de objetos"""
    start_time = datetime.now()
    
    try:
        if not model_loaded:
            logger.error("Tentativa de detecção sem modelo carregado")
            return jsonify({'error': 'Modelo YOLO não está carregado'}), 503
        
        data = request.get_json()
        
        if not data or 'image' not in data:
            logger.warning("Requisição sem imagem")
            return jsonify({'error': 'Imagem não fornecida'}), 400
        
        # Decodificar imagem
        image_array = decode_base64_image(data['image'])
        if image_array is None:
            return jsonify({'error': 'Erro ao processar imagem'}), 400
        
        logger.info(f"Iniciando detecção em imagem {image_array.shape}")
        
        # Executar detecção YOLO
        results = model(image_array)
        
        # Processar resultados
        detections = []
        annotated_image = image_array.copy()
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Extrair informações da detecção
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    
                    # Filtrar apenas classes relevantes com confiança > 0.3
                    if class_id in SATELLITE_CLASSES and confidence > 0.3:
                        class_name = SATELLITE_CLASSES[class_id]
                        
                        # Adicionar à lista de detecções
                        detections.append({
                            'class': class_name,
                            'confidence': round(confidence, 3),
                            'bbox': {
                                'x1': int(x1),
                                'y1': int(y1),
                                'x2': int(x2),
                                'y2': int(y2)
                            }
                        })
                        
                        # Desenhar retângulo na imagem
                        cv2.rectangle(annotated_image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                        
                        # Adicionar label
                        label = f"{class_name}: {confidence:.2f}"
                        cv2.putText(annotated_image, label, (int(x1), int(y1) - 10), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Codificar imagem anotada
        annotated_image_base64 = encode_image_to_base64(annotated_image)
        
        # Estatísticas
        stats = {
            'total_objects': len(detections),
            'classes_found': list(set([d['class'] for d in detections])),
            'avg_confidence': round(np.mean([d['confidence'] for d in detections]), 3) if detections else 0,
            'processing_time': (datetime.now() - start_time).total_seconds()
        }
        
        logger.info(f"Detecção concluída: {stats['total_objects']} objetos em {stats['processing_time']:.2f}s")
        
        return jsonify({
            'success': True,
            'detections': detections,
            'annotated_image': annotated_image_base64,
            'stats': stats
        })
        
    except Exception as e:
        logger.error(f"Erro na detecção: {e}")
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Retorna as classes de objetos detectáveis"""
    return jsonify({
        'classes': SATELLITE_CLASSES,
        'total_classes': len(SATELLITE_CLASSES),
        'model_loaded': model_loaded
    })

@app.route('/stats', methods=['GET'])
def get_server_stats():
    """Retorna estatísticas do servidor"""
    return jsonify({
        'model_loaded': model_loaded,
        'uptime': datetime.now().isoformat(),
        'total_classes': len(SATELLITE_CLASSES),
        'classes': list(SATELLITE_CLASSES.values())
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Erro interno do servidor: {error}")
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    logger.info("Iniciando servidor YOLO...")
    
    # Carregar modelo
    if not load_yolo_model():
        logger.error("Falha ao carregar modelo YOLO. Servidor iniciará mas não funcionará.")
    
    logger.info(f"Classes detectáveis: {len(SATELLITE_CLASSES)}")
    logger.info("Servidor disponível em: http://localhost:5000")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        logger.info("Servidor YOLO encerrado pelo usuário")
    except Exception as e:
        logger.error(f"Erro ao iniciar servidor: {e}")