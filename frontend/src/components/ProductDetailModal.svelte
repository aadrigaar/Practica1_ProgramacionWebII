<script>
  import { API_ROOT } from '../services/api.js';

  const { product, onClose } = $props();
  const active = product.activo ?? true;
  const isExternal = typeof product.imagen === 'string' && /^https?:\/\//i.test(product.imagen);
  const imageUrl = product.imagen
    ? (isExternal ? product.imagen : `${API_ROOT}/uploads/${product.imagen}`)
    : null;
</script>

<div class="modal" role="dialog" aria-modal="true">
  <div class="modal-card">
    <div class="row space">
      <div>
        <h2>{product.nombre}</h2>
        <div class="tag">ID: {product._id}</div>
      </div>
      <span class={`pill ${active ? '' : 'inactive'}`}>{active ? 'Activo' : 'No activo'}</span>
    </div>

    <div class="stack" style="margin-top: 1rem;">
      <strong>Precio</strong>
      <div>{Number(product.precio).toFixed(2)} EUR</div>
    </div>

    {#if product.categoria}
      <div class="stack" style="margin-top: 1rem;">
        <strong>Categoria</strong>
        <div>{product.categoria}</div>
      </div>
    {/if}

    {#if imageUrl}
      <div class="stack" style="margin-top: 1rem;">
        <strong>Imagen</strong>
        <img src={imageUrl} alt={`Imagen de ${product.nombre}`} style="border-radius: 14px; max-height: 260px; object-fit: cover;" />
      </div>
    {/if}

    <div class="row" style="margin-top: 1.4rem;">
      <button class="btn primary" on:click={onClose}>Cerrar</button>
    </div>
  </div>
</div>
