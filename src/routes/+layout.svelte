<script>
  import '../app.css';
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">
            <a href="/" class="hover:text-blue-600 transition-colors">
              📞 Agenda de Contatos
            </a>
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="/contatos"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Contatos
          </a>
          <a
            href="/compromissos"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Compromissos
          </a>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>