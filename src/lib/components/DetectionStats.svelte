<script>
  import { calculateDetectionStats } from '../utils.js';
  
  export let detections = [];
  export let processingTime = 0;
  
  $: stats = calculateDetectionStats(detections);
  $: sortedClasses = Object.entries(stats.byClass).sort((a, b) => b[1] - a[1]);
</script>

<div class="bg-white rounded-lg shadow-md p-6 space-y-4">
  <h3 class="text-lg font-semibold text-gray-800 flex items-center">
    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
    Estatísticas de Detecção
  </h3>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- Total de Objetos -->
    <div class="text-center p-4 bg-blue-50 rounded-lg">
      <div class="text-2xl font-bold text-blue-600">{stats.total}</div>
      <div class="text-sm text-gray-600">Objetos Detectados</div>
    </div>
    
    <!-- Confiança Média -->
    <div class="text-center p-4 bg-green-50 rounded-lg">
      <div class="text-2xl font-bold text-green-600">{(stats.avgConfidence * 100).toFixed(1)}%</div>
      <div class="text-sm text-gray-600">Confiança Média</div>
    </div>
    
    <!-- Alta Confiança -->
    <div class="text-center p-4 bg-yellow-50 rounded-lg">
      <div class="text-2xl font-bold text-yellow-600">{stats.highConfidence}</div>
      <div class="text-sm text-gray-600">Alta Confiança (≥70%)</div>
    </div>
    
    <!-- Tempo de Processamento -->
    <div class="text-center p-4 bg-purple-50 rounded-lg">
      <div class="text-2xl font-bold text-purple-600">{processingTime.toFixed(2)}s</div>
      <div class="text-sm text-gray-600">Tempo de Processo</div>
    </div>
  </div>
  
  {#if sortedClasses.length > 0}
    <div class="mt-6">
      <h4 class="text-md font-medium text-gray-700 mb-3">Objetos por Categoria</h4>
      <div class="space-y-2">
        {#each sortedClasses as [className, count], i}
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div 
                class="w-4 h-4 rounded-full mr-3"
                style="background-color: hsl({(i * 137.508) % 360}, 70%, 50%)"
              ></div>
              <span class="text-sm font-medium text-gray-700 capitalize">{className}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-bold text-gray-900 mr-2">{count}</span>
              <span class="text-xs text-gray-500">
                ({((count / stats.total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if detections.length === 0}
    <div class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <p>Nenhuma detecção disponível</p>
      <p class="text-sm">Faça upload de uma imagem para ver as estatísticas</p>
    </div>
  {/if}
</div>