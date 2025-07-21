<script>
  import { onMount } from 'svelte';
  
  let stats = {
    contatos: 0,
    compromissos: 0,
    compromissosHoje: 0
  };

  onMount(async () => {
    try {
      // Buscar estatísticas dos contatos
      const contatosRes = await fetch('/api/contatos');
      const contatos = await contatosRes.json();
      stats.contatos = contatos.length;

      // Buscar estatísticas dos compromissos
      const compromissosRes = await fetch('/api/compromissos');
      const compromissos = await compromissosRes.json();
      stats.compromissos = compromissos.length;

      // Buscar compromissos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const compromissosHojeRes = await fetch(`/api/compromissos?dataInicio=${hoje}&dataFim=${hoje}`);
      const compromissosHoje = await compromissosHojeRes.json();
      stats.compromissosHoje = compromissosHoje.length;
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  });
</script>

<svelte:head>
  <title>Agenda de Contatos - Página Inicial</title>
</svelte:head>

<div class="space-y-8">
  <!-- Hero Section -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      Bem-vindo à sua Agenda de Contatos
    </h1>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto">
      Gerencie seus contatos e organize seus compromissos de forma simples e eficiente
    </p>
  </div>

  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="card text-center">
      <div class="text-3xl font-bold text-blue-600 mb-2">{stats.contatos}</div>
      <div class="text-gray-600">Contatos Cadastrados</div>
    </div>
    
    <div class="card text-center">
      <div class="text-3xl font-bold text-green-600 mb-2">{stats.compromissos}</div>
      <div class="text-gray-600">Total de Compromissos</div>
    </div>
    
    <div class="card text-center">
      <div class="text-3xl font-bold text-orange-600 mb-2">{stats.compromissosHoje}</div>
      <div class="text-gray-600">Compromissos Hoje</div>
    </div>
  </div>

  <!-- Action Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <a href="/contatos" class="card hover:shadow-md transition-shadow group">
      <div class="flex items-center space-x-4">
        <div class="text-4xl">👥</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            Gerenciar Contatos
          </h3>
          <p class="text-gray-600 mt-1">
            Adicione, edite e organize seus contatos
          </p>
        </div>
      </div>
    </a>

    <a href="/compromissos" class="card hover:shadow-md transition-shadow group">
      <div class="flex items-center space-x-4">
        <div class="text-4xl">📅</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            Compromissos
          </h3>
          <p class="text-gray-600 mt-1">
            Agende e acompanhe seus compromissos
          </p>
        </div>
      </div>
    </a>
  </div>

  <!-- Quick Actions -->
  <div class="card">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
    <div class="flex flex-wrap gap-3">
      <a href="/contatos/novo" class="btn btn-primary">
        ➕ Novo Contato
      </a>
      <a href="/compromissos/novo" class="btn btn-primary">
        📅 Novo Compromisso
      </a>
      <a href="/compromissos?hoje=true" class="btn btn-secondary">
        🕐 Compromissos de Hoje
      </a>
    </div>
  </div>
</div>