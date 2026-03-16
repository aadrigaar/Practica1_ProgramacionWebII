<script>
  import { app, pushToast } from '../lib/state.svelte';
  import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products.js';
  import ProductCard from '../components/ProductCard.svelte';
  import ProductForm from '../components/ProductForm.svelte';
  import ProductDetailModal from '../components/ProductDetailModal.svelte';

  const isAdmin = $derived(app.user?.role === 'admin');
  const productCount = $derived(app.products.length);
  const visibleProducts = $derived.by(() => {
    const query = app.filter.query.trim().toLowerCase();
    const category = app.filter.category.trim().toLowerCase();
    const min = Number(app.filter.min);
    const max = Number(app.filter.max);
    const activeOnly = app.filter.activeOnly;

    return app.products.filter((product) => {
      const name = (product.nombre || '').toLowerCase();
      const cat = (product.categoria || '').toLowerCase();
      if (query && !name.includes(query)) return false;
      if (category && !cat.includes(category)) return false;
      if (!Number.isNaN(min) && min > 0 && Number(product.precio) < min) return false;
      if (!Number.isNaN(max) && max > 0 && Number(product.precio) > max) return false;
      const active = product.activo ?? true;
      if (activeOnly && !active) return false;
      return true;
    });
  });

  const pageSize = $derived(Number(app.filter.pageSize) || 6);
  const totalPages = $derived(Math.max(1, Math.ceil(visibleProducts.length / pageSize)));
  const currentPage = $derived(Math.min(app.filter.page, totalPages));
  const pagedProducts = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleProducts.slice(start, start + pageSize);
  });

  const filterKey = $derived(
    `${app.filter.query}|${app.filter.category}|${app.filter.min}|${app.filter.max}|${app.filter.activeOnly}`
  );
  let lastKey = $state(filterKey);

  $effect(() => {
    if (filterKey !== lastKey) {
      lastKey = filterKey;
      app.filter.page = 1;
    }
  });

  let showForm = $state(false);
  let editing = $state(null);
  let detail = $state(null);
  let saving = $state(false);

  async function loadProducts(name) {
    app.productsLoading = true;
    app.productsError = '';
    try {
      const data = await getProducts({ name, token: app.token });
      app.products = Array.isArray(data) ? data : [];
    } catch (err) {
      app.productsError = err.message || 'Error al cargar productos';
      pushToast(app.productsError, 'error');
    } finally {
      app.productsLoading = false;
    }
  }

  $effect(() => {
    if (!app.token || app.route !== 'productos') return;
    const timer = setTimeout(() => {
      loadProducts(app.filter.query.trim());
    }, 250);
    return () => clearTimeout(timer);
  });

  function openCreate() {
    editing = null;
    showForm = true;
  }

  function openEdit(product) {
    editing = product;
    showForm = true;
  }

  function openDetail(product) {
    detail = product;
  }

  function closeForm() {
    showForm = false;
    editing = null;
  }

  async function handleSave(payload) {
    saving = true;
    try {
      if (editing) {
        await updateProduct(editing._id, payload, app.token);
        pushToast('Producto actualizado', 'success');
      } else {
        await createProduct(payload, app.token);
        pushToast('Producto creado', 'success');
      }
      await loadProducts(app.filter.query.trim());
      closeForm();
    } catch (err) {
      pushToast(err.message || 'Error al guardar', 'error');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Eliminar ${product.nombre}?`)) return;
    try {
      await deleteProduct(product._id, app.token);
      pushToast('Producto eliminado', 'success');
      await loadProducts(app.filter.query.trim());
    } catch (err) {
      pushToast(err.message || 'Error al borrar', 'error');
    }
  }
</script>

<section class="layout">
  <div class="row space">
    <div>
      <h1 class="page-title">Productos</h1>
      <p class="subtitle">Gestiona el catalogo y consulta detalles.</p>
    </div>
    {#if isAdmin}
      <button class="btn primary" on:click={openCreate}>Nuevo producto</button>
    {/if}
  </div>

  <div class="card" style="margin-top: 1rem;">
    <div class="row">
      <div class="field" style="flex: 1;">
        <label>Buscar por nombre</label>
        <input type="text" bind:value={app.filter.query} placeholder="Buscar..." />
      </div>
      <div class="field" style="flex: 1;">
        <label>Categoria</label>
        <input type="text" bind:value={app.filter.category} placeholder="Perifericos, audio..." />
      </div>
      <div class="field">
        <label>Min EUR</label>
        <input type="number" min="0" step="0.01" bind:value={app.filter.min} />
      </div>
      <div class="field">
        <label>Max EUR</label>
        <input type="number" min="0" step="0.01" bind:value={app.filter.max} />
      </div>
      <div class="field">
        <label>Solo activos</label>
        <input type="checkbox" bind:checked={app.filter.activeOnly} />
      </div>
      <div class="field">
        <label>Por pagina</label>
        <select bind:value={app.filter.pageSize}>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="12">12</option>
        </select>
      </div>
    </div>
  </div>

  <p class="muted" style="margin-top: 0.8rem;">
    Mostrando {pagedProducts.length} de {visibleProducts.length} filtrados (total {productCount})
  </p>

  {#if app.productsLoading}
    <p class="muted" style="margin-top: 1rem;">Cargando productos...</p>
  {:else if app.productsError}
    <p class="error" style="margin-top: 1rem;">{app.productsError}</p>
  {:else}
    <div class="grid products" style="margin-top: 1rem;">
      {#each pagedProducts as product (product._id)}
        <ProductCard
          {product}
          canEdit={isAdmin}
          onView={openDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      {/each}
    </div>

    {#if visibleProducts.length === 0}
      <p class="muted" style="margin-top: 1rem;">No hay productos para mostrar.</p>
    {/if}

    {#if visibleProducts.length > 0}
      <div class="row space" style="margin-top: 1rem;">
        <button
          class="btn ghost"
          on:click={() => (app.filter.page = Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <div class="tag">Pagina {currentPage} de {totalPages}</div>
        <button
          class="btn ghost"
          on:click={() => (app.filter.page = Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Siguiente
        </button>
      </div>
    {/if}
  {/if}

  {#if showForm}
    <div class="modal">
      <div class="modal-card">
        <h2>{editing ? 'Editar producto' : 'Crear producto'}</h2>
        <ProductForm
          product={editing}
          mode={editing ? 'edit' : 'create'}
          onSave={handleSave}
          onCancel={closeForm}
          saving={saving}
        />
      </div>
    </div>
  {/if}

  {#if detail}
    <ProductDetailModal product={detail} onClose={() => (detail = null)} />
  {/if}
</section>
