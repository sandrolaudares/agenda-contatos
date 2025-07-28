<script>
  import '../app.css';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <h1 class="ml-3 text-xl font-bold text-gray-800">YOLO Satellite Detector</h1>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              IA Ativa
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>

  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="container mx-auto px-4 py-6">
      <div class="text-center text-gray-600 text-sm">
        <p>© 2024 YOLO Satellite Detector - Detecção de objetos em imagens de satélite usando IA</p>
      </div>
    </div>
  </footer>
</div>