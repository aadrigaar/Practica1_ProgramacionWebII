export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserFromToken(token) {
  const data = decodeJwt(token);
  if (!data) return null;
  return {
    id: data.id,
    username: data.username,
    role: data.role,
    exp: data.exp
  };
}

export function isTokenExpired(token) {
  const data = decodeJwt(token);
  if (!data?.exp) return false;
  return Date.now() > data.exp * 1000;
}
