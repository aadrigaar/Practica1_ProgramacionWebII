<script context="module">
  import { getUserFromToken, isTokenExpired } from '../services/jwt.js';

  function loadToken() {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem('token');
    if (!stored) return null;
    if (isTokenExpired(stored)) {
      localStorage.removeItem('token');
      return null;
    }
    return stored;
  }

  const savedToken = loadToken();
  const savedUser = savedToken ? getUserFromToken(savedToken) : null;

  export const app = $state({
    token: savedToken,
    user: savedUser,
    route: 'login',
    products: [],
    productsLoading: false,
    productsError: '',
    users: [],
    usersLoading: false,
    usersError: '',
    filter: {
      query: '',
      min: '',
      max: '',
      activeOnly: false
    },
    toasts: []
  });

  let toastId = 1;

  export function pushToast(message, type = 'info') {
    app.toasts = [
      ...app.toasts,
      { id: toastId++, message, type }
    ];
  }

  export function dismissToast(id) {
    app.toasts = app.toasts.filter((toast) => toast.id !== id);
  }
</script>
