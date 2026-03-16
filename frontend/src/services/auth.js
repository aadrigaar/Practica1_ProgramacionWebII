import { apiFetch } from './api.js';

export async function login(username, password) {
  return apiFetch('/login', {
    method: 'POST',
    body: { username, password }
  });
}
