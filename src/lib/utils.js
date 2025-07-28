/**
 * Utilitários para o YOLO Satellite Detector
 */

// Configurações da aplicação
export const config = {
  API_BASE_URL: 'http://localhost:5000',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  CONFIDENCE_THRESHOLD: 0.3
};

// Validar arquivo de imagem
export function validateImageFile(file) {
  const errors = [];
  
  if (!file) {
    errors.push('Nenhum arquivo selecionado');
    return { valid: false, errors };
  }
  
  if (!config.SUPPORTED_FORMATS.includes(file.type)) {
    errors.push(`Formato não suportado. Use: ${config.SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')}`);
  }
  
  if (file.size > config.MAX_FILE_SIZE) {
    errors.push(`Arquivo muito grande. Máximo: ${formatFileSize(config.MAX_FILE_SIZE)}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Formatar tamanho de arquivo
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Converter arquivo para base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Gerar cores únicas para classes
export function generateClassColors(numClasses) {
  const colors = [];
  for (let i = 0; i < numClasses; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
}

// Formatar coordenadas de bounding box
export function formatBoundingBox(box, imageWidth, imageHeight) {
  return {
    x: Math.round(box.x * imageWidth),
    y: Math.round(box.y * imageHeight),
    width: Math.round(box.width * imageWidth),
    height: Math.round(box.height * imageHeight)
  };
}

// Calcular estatísticas de detecção
export function calculateDetectionStats(detections) {
  const stats = {
    total: detections.length,
    byClass: {},
    avgConfidence: 0,
    highConfidence: 0
  };
  
  let totalConfidence = 0;
  
  detections.forEach(detection => {
    const className = detection.class;
    const confidence = detection.confidence;
    
    // Contar por classe
    stats.byClass[className] = (stats.byClass[className] || 0) + 1;
    
    // Somar confiança
    totalConfidence += confidence;
    
    // Contar alta confiança (>= 0.7)
    if (confidence >= 0.7) {
      stats.highConfidence++;
    }
  });
  
  // Calcular média de confiança
  stats.avgConfidence = detections.length > 0 ? totalConfidence / detections.length : 0;
  
  return stats;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Verificar se é uma imagem de satélite (heurística básica)
export function isSatelliteImage(file) {
  // Heurística simples baseada no nome do arquivo
  const filename = file.name.toLowerCase();
  const satelliteKeywords = ['satellite', 'sat', 'aerial', 'landsat', 'sentinel', 'spot', 'worldview'];
  
  return satelliteKeywords.some(keyword => filename.includes(keyword));
}

// Função para download de resultados
export function downloadResults(detections, filename) {
  const results = {
    filename: filename,
    timestamp: new Date().toISOString(),
    detections: detections,
    stats: calculateDetectionStats(detections)
  };
  
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `deteccoes_${filename.split('.')[0]}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}