<script>
  import { app, pushToast } from '../lib/state.svelte';
  import { login } from '../services/auth.js';
  import { getUserFromToken } from '../services/jwt.js';

  let form = $state({ username: '', password: '' });
  let loading = $state(false);
  let error = $state('');

  async function submit() {
    error = '';
    const username = form.username.trim();
    const password = form.password.trim();

    if (!username || !password) {
      error = 'Usuario y contrasena son obligatorios.';
      return;
    }

    loading = true;
    try {
      const result = await login(username, password);
      app.token = result.token;
      app.user = getUserFromToken(result.token);
      pushToast(`Bienvenido ${app.user?.username || ''}`, 'success');
    } catch (err) {
      error = err.message || 'Error al iniciar sesion';
    } finally {
      loading = false;
    }
  }
</script>

<section class="layout">
  <h1 class="page-title">Acceso</h1>
  <p class="subtitle">Inicia sesion para gestionar productos y usuarios.</p>

  <div class="card" style="max-width: 480px;">
    <div class="form-grid">
      <div class="field">
        <label for="username">Usuario</label>
        <input id="username" type="text" bind:value={form.username} placeholder="admin" />
      </div>
      <div class="field">
        <label for="password">Contrasena</label>
        <input id="password" type="password" bind:value={form.password} />
      </div>
    </div>

    {#if error}
      <div class="error" style="margin-top: 0.8rem;">{error}</div>
    {/if}

    <div class="row" style="margin-top: 1rem;">
      <button class="btn primary" on:click={submit} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </div>

    <p class="muted" style="margin-top: 1rem;">
      Si usas el seed del backend: admin/admin123 o user/user123.
    </p>
  </div>
</section>
