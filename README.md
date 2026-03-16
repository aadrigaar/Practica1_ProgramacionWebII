# Practica PW2 - Frontend Svelte 5

Frontend SPA para consumir el backend de la practica con JWT, roles y CRUD de productos y usuarios.

## Requisitos
- Node.js 18+
- Backend en `http://localhost:3000`

## Backend (incluido)
El backend esta en `backend/` (Node + Express + Mongo + Redis) y puede levantarse con Docker o local.
Redis es opcional: si no defines `REDIS_URL` o pones `REDIS_ENABLED=false`, el cache se desactiva.

Opcion 1 (recomendada): Docker Compose
1. `docker compose up --build`
2. El backend queda en `http://localhost:3000` y el seed crea usuarios `admin/admin123` y `user/user123`.

Opcion 2: Local
1. Copia `backend/.env.example` a `backend/.env` y ajusta variables.
   Si no tienes Redis, omite `REDIS_URL` o añade `REDIS_ENABLED=false`.
2. `cd backend`
3. `npm install`
4. `node seed.js`
5. `npm run dev`

## Instalacion y ejecucion
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Si tu backend no usa `http://localhost:3000/api`, crea un `.env` en `frontend` con:

```
VITE_API_BASE=http://localhost:3000/api
```

## Runes de Svelte 5 usadas
- `$state`: `frontend/src/lib/state.svelte`, `frontend/src/pages/ProductsPage.svelte`, `frontend/src/pages/AdminPage.svelte`, `frontend/src/pages/ProfilePage.svelte`, `frontend/src/components/ProductForm.svelte`, `frontend/src/components/UserRow.svelte`.
- `$derived`: `frontend/src/lib/state.svelte`, `frontend/src/pages/ProfilePage.svelte`.
- `$effect`: `frontend/src/App.svelte`, `frontend/src/pages/ProductsPage.svelte`, `frontend/src/pages/AdminPage.svelte`, `frontend/src/components/ToastStack.svelte`.
- `$props`: `frontend/src/components/ProductCard.svelte`, `frontend/src/components/ProductForm.svelte`, `frontend/src/components/ProductDetailModal.svelte`, `frontend/src/components/UserRow.svelte`.

## Endpoints del backend usados
- `POST /api/login` (autenticacion JWT)
- `GET /api/productos`, `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`
- `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`
- `GET /uploads/:filename` para imagenes de productos

## Roles
La interfaz muestra acciones segun rol:
- Admin: crear, editar y borrar productos. Gestion de usuarios.
- User: solo lectura de productos.
