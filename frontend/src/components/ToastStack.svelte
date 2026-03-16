<script>
  import { app, dismissToast } from '../lib/state.svelte';

  const timers = new Map();

  $effect(() => {
    const ids = new Set(app.toasts.map((toast) => toast.id));
    app.toasts.forEach((toast) => {
      if (timers.has(toast.id)) return;
      const timer = setTimeout(() => {
        dismissToast(toast.id);
        timers.delete(toast.id);
      }, 3500);
      timers.set(toast.id, timer);
    });

    for (const [id, timer] of timers.entries()) {
      if (!ids.has(id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    }
  });
</script>

<div class="toast-stack" aria-live="polite">
  {#each app.toasts as toast (toast.id)}
    <div class={`toast ${toast.type}`}>
      <div class="row space">
        <strong>{toast.message}</strong>
        <button class="btn ghost" on:click={() => dismissToast(toast.id)}>Cerrar</button>
      </div>
    </div>
  {/each}
</div>
