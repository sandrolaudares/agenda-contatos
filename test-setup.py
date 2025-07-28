#!/usr/bin/env python3
"""
Script para testar se todas as dependências YOLO estão instaladas corretamente
"""

import sys
import importlib

def test_import(module_name, description):
    """Testa a importação de um módulo"""
    try:
        importlib.import_module(module_name)
        print(f"✅ {description}")
        return True
    except ImportError as e:
        print(f"❌ {description} - Erro: {e}")
        return False

def main():
    print("🧪 Testando instalação do YOLO Satellite Detector...")
    print("=" * 50)
    
    # Lista de módulos para testar
    modules = [
        ("ultralytics", "YOLO (Ultralytics)"),
        ("cv2", "OpenCV"),
        ("PIL", "Pillow (PIL)"),
        ("flask", "Flask"),
        ("flask_cors", "Flask-CORS"),
        ("numpy", "NumPy"),
        ("torch", "PyTorch"),
        ("torchvision", "TorchVision"),
        ("requests", "Requests")
    ]
    
    success_count = 0
    total_count = len(modules)
    
    for module_name, description in modules:
        if test_import(module_name, description):
            success_count += 1
    
    print("\n" + "=" * 50)
    print(f"Resultado: {success_count}/{total_count} módulos instalados corretamente")
    
    if success_count == total_count:
        print("🎉 Todas as dependências estão instaladas!")
        print("\nPróximos passos:")
        print("1. Execute: python src/python/yolo_server.py")
        print("2. Em outro terminal: npm run dev")
        return 0
    else:
        print("⚠️ Algumas dependências estão faltando")
        print("Execute: pip install -r requirements.txt")
        return 1

if __name__ == "__main__":
    sys.exit(main())