<script>
  import './app.css';
  import { app, pushToast } from './lib/state.svelte';
  import { getUserFromToken, isTokenExpired } from './services/jwt.js';
  import LoginPage from './pages/LoginPage.svelte';
  import ProductsPage from './pages/ProductsPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import AdminPage from './pages/AdminPage.svelte';
  import ToastStack from './components/ToastStack.svelte';

  const knownRoutes = new Set(['login', 'productos', 'perfil', 'admin']);

  const isAuthed = $derived(!!app.token && !!app.user);
  const isAdmin = $derived(app.user?.role === 'admin');

  function normalizeRoute(hash) {
    const route = hash.replace(/^#\/?/, '').trim();
    if (knownRoutes.has(route)) return route;
    return isAuthed ? 'productos' : 'login';
  }

  function navigate(route) {
    window.location.hash = `#/${route}`;
  }

  function logout() {
    app.token = null;
    app.user = null;
    pushToast('Sesion cerrada', 'info');
  }

  $effect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      app.route = normalizeRoute(window.location.hash);
    };
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  });

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    if (app.token) {
      localStorage.setItem('token', app.token);
    } else {
      localStorage.removeItem('token');
    }
  });

  $effect(() => {
    if (!app.token) {
      app.user = null;
      app.products = [];
      app.users = [];
      return;
    }
    if (isTokenExpired(app.token)) {
      app.token = null;
      app.user = null;
      pushToast('Sesion expirada, inicia sesion otra vez.', 'warn');
      return;
    }
    app.user = getUserFromToken(app.token);
  });

  $effect(() => {
    if (!isAuthed && app.route !== 'login') {
      navigate('login');
    }
    if (isAuthed && app.route === 'login') {
      navigate('productos');
    }
    if (app.route === 'admin' && !isAdmin) {
      navigate('productos');
    }
  });
</script>

<div class="app">
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">Tienda PW2</div>
      <nav class="nav">
        {#if isAuthed}
          <a href="#/productos" class:active={app.route === 'productos'}>Productos</a>
          <a href="#/perfil" class:active={app.route === 'perfil'}>Perfil</a>
          {#if isAdmin}
            <a href="#/admin" class:active={app.route === 'admin'}>Admin</a>
          {/if}
          <button class="btn ghost" on:click={logout}>Salir</button>
        {:else}
          <a href="#/login" class:active={app.route === 'login'}>Login</a>
        {/if}
      </nav>
    </div>
  </header>

  <main>
    {#if app.route === 'login'}
      <LoginPage />
    {:else if app.route === 'productos'}
      <ProductsPage />
    {:else if app.route === 'perfil'}
      <ProfilePage />
    {:else if app.route === 'admin'}
      <AdminPage />
    {/if}
  </main>

  <footer class="footer">
    PW2 Frontend en Svelte 5 con JWT y panel de administracion.
  </footer>

  <ToastStack />
</div>
