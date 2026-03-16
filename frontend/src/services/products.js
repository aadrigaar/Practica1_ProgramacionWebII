import { apiFetch } from './api.js';

export async function getProducts({ name, token } = {}) {
  const query = name ? `?name=${encodeURIComponent(name)}` : '';
  return apiFetch(`/productos${query}`, { token });
}

export async function createProduct({ nombre, precio, imagen, imagenUrl }, token) {
  const form = new FormData();
  form.append('nombre', nombre);
  form.append('precio', String(precio));
  if (imagen) form.append('imagen', imagen);
  if (!imagen && imagenUrl) form.append('imagenUrl', imagenUrl);
  return apiFetch('/productos', {
    method: 'POST',
    token,
    body: form,
    isForm: true
  });
}

export async function updateProduct(id, { nombre, precio, imagenUrl, imagen }, token) {
  return apiFetch(`/productos/${id}`, {
    method: 'PUT',
    token,
    body: { nombre, precio, imagenUrl, imagen }
  });
}

export async function deleteProduct(id, token) {
  return apiFetch(`/productos/${id}`, {
    method: 'DELETE',
    token
  });
}
