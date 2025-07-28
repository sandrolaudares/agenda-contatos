<script>
  import { onMount } from 'svelte';
  
  let files;
  let selectedImage = null;
  let imagePreview = null;
  let detectionResults = null;
  let annotatedImage = null;
  let isProcessing = false;
  let serverStatus = 'checking';
  let uploadArea;
  let isDragging = false;

  // Verificar status do servidor YOLO
  async function checkServerStatus() {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        serverStatus = 'online';
      } else {
        serverStatus = 'offline';
      }
    } catch (error) {
      serverStatus = 'offline';
    }
  }

  // Converter arquivo para base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Processar upload de imagem
  async function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    selectedImage = file;
    imagePreview = await fileToBase64(file);
    detectionResults = null;
    annotatedImage = null;
  }

  // Executar detecção de objetos
  async function detectObjects() {
    if (!selectedImage) {
      alert('Selecione uma imagem primeiro.');
      return;
    }

    if (serverStatus !== 'online') {
      alert('Servidor YOLO não está disponível. Certifique-se de que está executando.');
      return;
    }

    isProcessing = true;

    try {
      const base64Image = await fileToBase64(selectedImage);
      
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      const result = await response.json();

      if (result.success) {
        detectionResults = result;
        annotatedImage = result.annotated_image;
      } else {
        alert(`Erro na detecção: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar imagem. Verifique se o servidor YOLO está executando.');
    } finally {
      isProcessing = false;
    }
  }

  // Eventos de drag and drop
  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleImageUpload(droppedFiles[0]);
    }
  }

  // Tratar mudança no input de arquivo
  function handleFileChange() {
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  }

  onMount(() => {
    checkServerStatus();
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  });
</script>

<div class="max-w-6xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      Detecção de Objetos em Imagens de Satélite
    </h1>
    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
      Use inteligência artificial YOLO para identificar automaticamente objetos como veículos, 
      pessoas, animais e estruturas em imagens de satélite de alta resolução.
    </p>
  </div>

  <!-- Status do Servidor -->
  <div class="bg-white rounded-lg shadow-md p-4 mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full {serverStatus === 'online' ? 'bg-green-500' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}"></div>
          <span class="ml-2 text-sm font-medium text-gray-700">
            Servidor YOLO: {serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Verificando...'}
          </span>
        </div>
      </div>
      {#if serverStatus === 'offline'}
        <div class="text-sm text-red-600">
          Execute: <code class="bg-gray-100 px-2 py-1 rounded">npm run python:serve</code>
        </div>
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Upload de Imagem -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Upload de Imagem</h2>
      
      <!-- Área de Upload -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors
               {isDragging ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        bind:this={uploadArea}
      >
        <input 
          type="file" 
          accept="image/*" 
          bind:files 
          on:change={handleFileChange}
          class="hidden" 
          id="imageUpload"
        >
        
        <label for="imageUpload" class="cursor-pointer">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="text-lg text-gray-600 mb-2">Clique para selecionar ou arraste uma imagem</p>
          <p class="text-sm text-gray-400">Suporta JPG, PNG, WebP (máx. 10MB)</p>
        </label>
      </div>

      <!-- Preview da Imagem -->
      {#if imagePreview}
        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Imagem Selecionada</h3>
          <div class="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              class="w-full h-64 object-cover rounded-lg border border-gray-200"
            >
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {selectedImage.name}
            </div>
          </div>
          
          <!-- Botão de Detecção -->
          <button 
            on:click={detectObjects}
            disabled={isProcessing || serverStatus !== 'online'}
            class="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {#if isProcessing}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            {:else}
              🎯 Detectar Objetos
            {/if}
          </button>
        </div>
      {/if}
    </div>

    <!-- Resultados -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Resultados da Detecção</h2>
      
      {#if !detectionResults}
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="text-gray-500">Selecione uma imagem e clique em "Detectar Objetos" para ver os resultados</p>
        </div>
      {:else}
        <!-- Estatísticas -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{detectionResults.stats.total_objects}</div>
            <div class="text-sm text-blue-700">Objetos Detectados</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">{detectionResults.stats.classes_found.length}</div>
            <div class="text-sm text-green-700">Classes Diferentes</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">{(detectionResults.stats.avg_confidence * 100).toFixed(1)}%</div>
            <div class="text-sm text-purple-700">Confiança Média</div>
          </div>
        </div>

        <!-- Imagem com Anotações -->
        {#if annotatedImage}
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Imagem com Detecções</h3>
            <img 
              src={annotatedImage} 
              alt="Imagem com detecções" 
              class="w-full h-64 object-cover rounded-lg border border-gray-200"
            >
          </div>
        {/if}

        <!-- Lista de Detecções -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">Objetos Identificados</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            {#each detectionResults.detections as detection, index}
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <span class="font-medium text-gray-900 capitalize">{detection.class}</span>
                    <div class="text-sm text-gray-500">
                      Posição: ({detection.bbox.x1}, {detection.bbox.y1}) - ({detection.bbox.x2}, {detection.bbox.y2})
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-green-600">{(detection.confidence * 100).toFixed(1)}%</div>
                  <div class="text-xs text-gray-500">confiança</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Informações Adicionais -->
  <div class="mt-12 bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Como Funciona</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>
        <h3 class="font-medium text-gray-900 mb-2">1. Upload da Imagem</h3>
        <p class="text-sm text-gray-600">Faça upload de uma imagem de satélite em formato JPG, PNG ou WebP</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 class="font-medium text-gray-900 mb-2">2. Processamento IA</h3>
        <p class="text-sm text-gray-600">O modelo YOLO analisa a imagem e identifica objetos automaticamente</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 class="font-medium text-gray-900 mb-2">3. Resultados</h3>
        <p class="text-sm text-gray-600">Veja os objetos detectados com suas posições e níveis de confiança</p>
      </div>
    </div>
  </div>
</div>