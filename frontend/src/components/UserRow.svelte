<script>
  const { user, onUpdate, onDelete, saving = false } = $props();
  let role = $state(user.role);
  let password = $state('');
  let error = $state('');

  function submit() {
    error = '';
    if (!role) {
      error = 'Rol obligatorio.';
      return;
    }
    const payload = { role };
    if (password.trim()) payload.password = password.trim();
    onUpdate?.(user._id, payload);
    password = '';
  }
</script>

<div class="card">
  <div class="row space">
    <div class="stack">
      <strong>{user.username}</strong>
      <span class="tag">ID: {user._id}</span>
    </div>
    <span class={`pill ${role === 'admin' ? '' : 'inactive'}`}>
      {role === 'admin' ? 'Admin' : 'User'}
    </span>
  </div>

  <div class="form-grid" style="margin-top: 0.8rem;">
    <div class="field">
      <label>Rol</label>
      <select bind:value={role}>
        <option value="user">Usuario</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div class="field">
      <label>Nueva contrasena (opcional)</label>
      <input type="password" bind:value={password} placeholder="********" />
    </div>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <div class="row" style="margin-top: 0.8rem;">
    <button class="btn primary" on:click={submit} disabled={saving}>
      {saving ? 'Guardando...' : 'Guardar'}
    </button>
    <button class="btn danger" on:click={() => onDelete?.(user)} disabled={saving}>
      Borrar
    </button>
  </div>
</div>
