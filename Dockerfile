# Use uma imagem base que inclui Python e Node.js
FROM node:18-bullseye

# Instalar Python e dependências do sistema
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgthread-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY requirements.txt ./

# Instalar dependências Node.js
RUN npm ci --only=production

# Instalar dependências Python
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Expor portas
EXPOSE 3000 5000

# Criar script de inicialização
RUN echo '#!/bin/bash\npython3 src/python/yolo_server.py &\nnpm run preview -- --host 0.0.0.0 --port 3000' > start.sh
RUN chmod +x start.sh

# Comando para iniciar ambos os serviços
CMD ["./start.sh"]