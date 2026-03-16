import { apiFetch } from './api.js';

export async function getUsers(token) {
  return apiFetch('/users', { token });
}

export async function createUser(payload, token) {
  return apiFetch('/users', {
    method: 'POST',
    token,
    body: payload
  });
}

export async function updateUser(id, payload, token) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    token,
    body: payload
  });
}

export async function deleteUser(id, token) {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE',
    token
  });
}
