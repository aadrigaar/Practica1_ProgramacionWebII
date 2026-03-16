# Practica PW2 - Programacion Web II

Frontend SPA en Svelte 5 con JWT y roles, conectado a un backend Node.js (incluido). Cumple todos los puntos del enunciado, incluidos los opcionales para nota maxima.

## Requisitos
- Node.js 18+
- MongoDB en local (servicio o `mongod`)
- Opcional: Docker Desktop (para levantar todo con `docker compose`)

## Backend (incluido)
El backend esta en `backend/` (Node + Express + Mongo + Redis). Redis es **opcional**: si no defines `REDIS_URL` o pones `REDIS_ENABLED=false`, el cache se desactiva.

### Opcion A: Local (sin Docker)
1. Crea `backend/.env` con:
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/productos
JWT_SECRET=Clave
REDIS_ENABLED=false
```
2. Instala dependencias:
```
cd backend
npm install
```
3. Crea usuarios base:
```
node seed.js
```
4. Arranca backend:
```
npm run dev
```

### Opcion B: Docker Compose
```
docker compose up --build
```
Backend en `http://localhost:3000`.

Usuarios de prueba:
- `admin / admin123`
- `user / user123`

## Frontend
```
cd frontend
npm install
npm run dev
```
Vite sirve la app normalmente en `http://localhost:5173`.

Si tu backend no usa `http://localhost:3000/api`, crea `frontend/.env` con:
```
VITE_API_BASE=http://localhost:3000/api
```

## Estructura del proyecto
- `frontend/src/components`: componentes reutilizables
- `frontend/src/pages`: pantallas SPA (Login, Productos, Perfil, Admin)
- `frontend/src/services`: llamadas a API

## Runes de Svelte 5 usadas
- `$state`: `frontend/src/lib/state.svelte`, `frontend/src/pages/ProductsPage.svelte`, `frontend/src/pages/AdminPage.svelte`, `frontend/src/pages/ProfilePage.svelte`, `frontend/src/components/ProductForm.svelte`, `frontend/src/components/UserRow.svelte`
- `$derived`: `frontend/src/App.svelte`, `frontend/src/pages/ProductsPage.svelte`, `frontend/src/pages/ProfilePage.svelte`
- `$effect`: `frontend/src/App.svelte`, `frontend/src/pages/ProductsPage.svelte`, `frontend/src/pages/AdminPage.svelte`, `frontend/src/components/ToastStack.svelte`
- `$props`: `frontend/src/components/ProductCard.svelte`, `frontend/src/components/ProductForm.svelte`, `frontend/src/components/ProductDetailModal.svelte`, `frontend/src/components/UserRow.svelte`

## Endpoints del backend usados
- `POST /api/login` (JWT)
- `GET /api/productos`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /uploads/:filename` (imagenes subidas)

## Funcionalidades (checklist del enunciado)

### Requisitos minimos
- Vite + Svelte 5 con organizacion en `components`, `pages`, `services`.
- Login con usuario y contrasena, envio de credenciales y errores gestionados.
- Token JWT en memoria y proteccion de pantallas privadas si no hay login.
- CRUD de productos con listado (nombre, precio, activo), detalle modal, crear, editar, borrar.
- Navegacion SPA con Login, Productos, Perfil y resaltado de pantalla actual.
- Estilos cuidados y responsive.

### Svelte 5 (Runes)
- `$state` para estado global (usuario, token, productos, filtros).
- `$derived` para derivados (productos filtrados, paginacion, rol).
- `$effect` para redirecciones y sincronizacion con backend.
- `$props` y callbacks para comunicacion padre-hijo (ProductCard, ProductForm, UserRow).

### Funcionalidades avanzadas (maxima nota)
- Administracion de usuarios y roles (solo admin).
- Persistencia de sesion (localStorage) y cierre de sesion correcto.
- Filtros por nombre, **categoria** y **rango de precio**.
- Paginacion en frontend.
- Validaciones de formularios y botones deshabilitados al guardar.
- Feedback de carga, toasts de error y confirmaciones de borrado.

## Campos de producto
Un producto incluye:
- `nombre` (string)
- `precio` (number)
- `activo` (boolean)
- `categoria` (string, opcional)
- `imagen` (archivo subido o link externo)

## Nota sobre imagenes
Se puede usar archivo o link:
- Subida: se guarda el filename y se sirve desde `/uploads`
- Link: se guarda la URL en `imagen`

## Entrega
Repositorio publico:
- https://github.com/aadrigaar/Practica1_ProgramacionWebII

Fecha limite:
- 25 de marzo de 2026 a las 23:59
