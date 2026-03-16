<script>
  const { product, onView, onEdit, onDelete, canEdit } = $props();
  const active = product.activo ?? true;
</script>

<article class="card">
  <div class="row space">
    <div>
      <h3>{product.nombre}</h3>
      <div class="tag">Precio: {Number(product.precio).toFixed(2)} EUR</div>
    </div>
    <span class={`pill ${active ? '' : 'inactive'}`}>
      {active ? 'Activo' : 'No activo'}
    </span>
  </div>
  <div class="row" style="margin-top: 0.8rem;">
    <button class="btn secondary" on:click={() => onView?.(product)}>Detalle</button>
    {#if canEdit}
      <button class="btn ghost" on:click={() => onEdit?.(product)}>Editar</button>
      <button class="btn danger" on:click={() => onDelete?.(product)}>Borrar</button>
    {/if}
  </div>
</article>
