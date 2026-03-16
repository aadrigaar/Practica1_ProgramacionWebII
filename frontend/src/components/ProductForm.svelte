<script>
  const { product = null, mode = 'create', onSave, onCancel, saving = false } = $props();

  let form = $state({
    nombre: product?.nombre || '',
    precio: product?.precio ?? '',
    imagen: null,
    activo: product?.activo ?? true,
    imagenUrl: typeof product?.imagen === 'string' && /^https?:\/\//i.test(product.imagen)
      ? product.imagen
      : ''
  });

  let error = $state('');

  function handleFile(event) {
    form.imagen = event.currentTarget.files?.[0] || null;
  }

  function submit() {
    error = '';
    const nombre = form.nombre.trim();
    const precio = Number(form.precio);
    const imagenUrl = form.imagenUrl.trim();

    if (!nombre) {
      error = 'El nombre es obligatorio.';
      return;
    }
    if (Number.isNaN(precio) || precio <= 0) {
      error = 'El precio debe ser mayor que 0.';
      return;
    }

    if (imagenUrl && !/^https?:\/\//i.test(imagenUrl)) {
      error = 'El link de imagen debe empezar por http o https.';
      return;
    }

    onSave?.({
      nombre,
      precio,
      imagen: form.imagen,
      imagenUrl,
      activo: form.activo
    });
  }
</script>

<div class="stack">
  <div class="form-grid">
    <div class="field">
      <label for="nombre">Nombre</label>
      <input id="nombre" type="text" bind:value={form.nombre} placeholder="Ej. Teclado mecanico" />
    </div>
    <div class="field">
      <label for="precio">Precio</label>
      <input id="precio" type="number" min="0" step="0.01" bind:value={form.precio} />
    </div>
    {#if mode === 'create'}
      <div class="field">
        <label for="imagen">Imagen (opcional)</label>
        <input id="imagen" type="file" accept="image/*" on:change={handleFile} />
      </div>
    {/if}
    <div class="field">
      <label for="imagenUrl">Imagen por link (opcional)</label>
      <input
        id="imagenUrl"
        type="url"
        bind:value={form.imagenUrl}
        placeholder="https://..."
      />
    </div>
    <div class="field">
      <label>Activo</label>
      <input type="checkbox" bind:checked={form.activo} />
    </div>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <div class="row">
    <button class="btn primary" on:click={submit} disabled={saving}>
      {saving ? 'Guardando...' : 'Guardar'}
    </button>
    <button class="btn ghost" on:click={onCancel} disabled={saving}>Cancelar</button>
  </div>
</div>
