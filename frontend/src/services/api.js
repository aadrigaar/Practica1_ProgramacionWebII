const RAW_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
export const API_BASE = RAW_BASE.replace(/\/$/, '');
export const API_ROOT = API_BASE.replace(/\/api\/?$/, '');

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    token,
    headers = {},
    body,
    isForm = false
  } = options;

  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const finalHeaders = { ...headers };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const config = { method, headers: finalHeaders };

  if (body !== undefined) {
    if (isForm) {
      config.body = body;
    } else {
      finalHeaders['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Error ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
