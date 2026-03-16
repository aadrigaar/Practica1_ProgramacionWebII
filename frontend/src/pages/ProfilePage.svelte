<script>
  import { app, pushToast } from '../lib/state.svelte';
  import { isTokenExpired } from '../services/jwt.js';

  const expiresAt = $derived(app.user?.exp ? new Date(app.user.exp * 1000) : null);
  const isAdmin = $derived(app.user?.role === 'admin');

  function logout() {
    app.token = null;
    app.user = null;
    pushToast('Sesion cerrada', 'info');
  }
</script>

<section class="layout">
  <h1 class="page-title">Perfil</h1>
  <p class="subtitle">Informacion de tu cuenta y sesion.</p>

  <div class="card" style="max-width: 640px;">
    <div class="stack">
      <div><strong>Usuario:</strong> {app.user?.username}</div>
      <div><strong>Rol:</strong> {app.user?.role}</div>
      {#if expiresAt}
        <div><strong>Expira:</strong> {expiresAt.toLocaleString()}</div>
      {/if}
      {#if app.token && isTokenExpired(app.token)}
        <div class="error">El token ha expirado.</div>
      {/if}
      {#if isAdmin}
        <div class="success">Tienes acceso de administrador.</div>
      {/if}
    </div>

    <div class="row" style="margin-top: 1rem;">
      <button class="btn danger" on:click={logout}>Cerrar sesion</button>
    </div>
  </div>
</section>
