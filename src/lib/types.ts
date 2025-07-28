// Tipos para o aplicativo YOLO Satellite Detector

export interface Detection {
  class: string;
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DetectionResult {
  success: boolean;
  detections: Detection[];
  annotated_image: string;
  stats: {
    total_objects: number;
    classes_found: string[];
    avg_confidence: number;
  };
  processing_time: number;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface DetectionStats {
  total: number;
  byClass: Record<string, number>;
  avgConfidence: number;
  highConfidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppConfig {
  API_BASE_URL: string;
  MAX_FILE_SIZE: number;
  SUPPORTED_FORMATS: string[];
  CONFIDENCE_THRESHOLD: number;
}