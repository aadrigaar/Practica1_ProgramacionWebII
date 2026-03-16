import { apiFetch } from './api.js';

export async function getProducts({ name, token } = {}) {
  const query = name ? `?name=${encodeURIComponent(name)}` : '';
  return apiFetch(`/productos${query}`, { token });
}

export async function createProduct({ nombre, precio, imagen, imagenUrl, activo, categoria }, token) {
  const form = new FormData();
  form.append('nombre', nombre);
  form.append('precio', String(precio));
  if (categoria) form.append('categoria', categoria);
  form.append('activo', String(!!activo));
  if (imagen) form.append('imagen', imagen);
  if (!imagen && imagenUrl) form.append('imagenUrl', imagenUrl);
  return apiFetch('/productos', {
    method: 'POST',
    token,
    body: form,
    isForm: true
  });
}

export async function updateProduct(id, { nombre, precio, imagenUrl, imagen, activo, categoria }, token) {
  return apiFetch(`/productos/${id}`, {
    method: 'PUT',
    token,
    body: { nombre, precio, imagenUrl, imagen, activo, categoria }
  });
}

export async function deleteProduct(id, token) {
  return apiFetch(`/productos/${id}`, {
    method: 'DELETE',
    token
  });
}
