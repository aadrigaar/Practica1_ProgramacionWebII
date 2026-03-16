<script>
  import { app, pushToast } from '../lib/state.svelte';
  import { getUsers, createUser, updateUser, deleteUser } from '../services/users.js';
  import UserRow from '../components/UserRow.svelte';

  let form = $state({ username: '', password: '', role: 'user' });
  let creating = $state(false);
  let savingId = $state('');
  let error = $state('');

  const isAdmin = $derived(app.user?.role === 'admin');

  async function loadUsers() {
    app.usersLoading = true;
    app.usersError = '';
    try {
      const data = await getUsers(app.token);
      app.users = Array.isArray(data) ? data : [];
    } catch (err) {
      app.usersError = err.message || 'Error al cargar usuarios';
      pushToast(app.usersError, 'error');
    } finally {
      app.usersLoading = false;
    }
  }

  $effect(() => {
    if (!app.token || !isAdmin || app.route !== 'admin') return;
    loadUsers();
  });

  async function handleCreate() {
    error = '';
    if (!form.username.trim() || !form.password.trim()) {
      error = 'Usuario y contrasena son obligatorios.';
      return;
    }
    creating = true;
    try {
      await createUser(
        {
          username: form.username.trim(),
          password: form.password.trim(),
          role: form.role
        },
        app.token
      );
      pushToast('Usuario creado', 'success');
      form.username = '';
      form.password = '';
      form.role = 'user';
      await loadUsers();
    } catch (err) {
      error = err.message || 'Error al crear usuario';
    } finally {
      creating = false;
    }
  }

  async function handleUpdate(id, payload) {
    savingId = id;
    try {
      await updateUser(id, payload, app.token);
      pushToast('Usuario actualizado', 'success');
      await loadUsers();
    } catch (err) {
      pushToast(err.message || 'Error al actualizar usuario', 'error');
    } finally {
      savingId = '';
    }
  }

  async function handleDelete(user) {
    if (user._id === app.user?.id) {
      pushToast('No puedes borrar tu propio usuario admin.', 'error');
      return;
    }
    if (!confirm(`Eliminar usuario ${user.username}?`)) return;
    savingId = user._id;
    try {
      await deleteUser(user._id, app.token);
      pushToast('Usuario eliminado', 'success');
      await loadUsers();
    } catch (err) {
      pushToast(err.message || 'Error al borrar usuario', 'error');
    } finally {
      savingId = '';
    }
  }
</script>

<section class="layout">
  <h1 class="page-title">Administracion</h1>
  <p class="subtitle">Gestion de usuarios y roles.</p>

  {#if !isAdmin}
    <p class="error">No tienes permisos para ver esta seccion.</p>
  {:else}
    <div class="card" style="margin-bottom: 1rem;">
      <h3>Crear usuario</h3>
      <div class="form-grid" style="margin-top: 0.8rem;">
        <div class="field">
          <label>Usuario</label>
          <input type="text" bind:value={form.username} />
        </div>
        <div class="field">
          <label>Contrasena</label>
          <input type="password" bind:value={form.password} />
        </div>
        <div class="field">
          <label>Rol</label>
          <select bind:value={form.role}>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      {#if error}
        <div class="error" style="margin-top: 0.6rem;">{error}</div>
      {/if}
      <div class="row" style="margin-top: 0.8rem;">
        <button class="btn primary" on:click={handleCreate} disabled={creating}>
          {creating ? 'Creando...' : 'Crear usuario'}
        </button>
      </div>
    </div>

    {#if app.usersLoading}
      <p class="muted">Cargando usuarios...</p>
    {:else if app.usersError}
      <p class="error">{app.usersError}</p>
    {:else}
      <div class="grid">
        {#each app.users as user (user._id)}
          <UserRow
            {user}
            saving={savingId === user._id}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        {/each}
      </div>
    {/if}
  {/if}
</section>
