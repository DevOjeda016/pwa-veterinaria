# 🐾 HuellitasVet — PWA de Clínica Veterinaria

PWA hecha con **React + Vite** en el frontend y **Node + Express + SQLite** en el backend.

## Pantallas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Landing page | Pública |
| `/login` | Iniciar sesión | Pública |
| `/registro` | Crear cuenta | Pública |
| `/app/mascotas` | Mis mascotas (alta, edición, borrado) | Requiere sesión |
| `/app/citas` | Mis citas (agendar, cancelar, historial) | Requiere sesión |
| `/app/servicios` | Catálogo de servicios con buscador | Requiere sesión |

El **logout** está en la barra lateral (escritorio) o en el ícono superior derecho (móvil).

## Base de datos SQLite

- Se usa el módulo `node:sqlite` que ya viene con Node.js 22.13 o superior (no hay que instalar nada extra).
- El archivo de la base de datos es `servidor/veterinaria.db` y **se crea solo** la primera vez que arranca el servidor.
- Las tablas y los servicios iniciales están en `servidor/esquema.sql`.
- Tablas: `usuarios`, `sesiones`, `servicios`, `mascotas`, `citas`.
- Las contraseñas se guardan cifradas con `scrypt`.
- Para ver o editar la base de datos puedes usar [DB Browser for SQLite](https://sqlitebrowser.org) o la extensión *SQLite Viewer* de VS Code.
- Para reiniciar la base de datos, detén el servidor y borra `servidor/veterinaria.db`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/yo` | Usuario actual |
| GET | `/api/servicios` | Catálogo de servicios |
| GET / POST | `/api/mascotas` | Listar / crear mascotas |
| PUT / DELETE | `/api/mascotas/:id` | Editar / eliminar mascota |
| GET / POST | `/api/citas` | Listar / agendar citas |
| PATCH / DELETE | `/api/citas/:id` | Cambiar estado / eliminar cita |

## Ejecutar

```bash
npm install
npm run dev      # levanta servidor (puerto 3001) y Vite (puerto 5173) al mismo tiempo
```

Abre <http://localhost:5173>.

Para producción (y para probar la instalación PWA y el modo sin conexión):

```bash
npm run build
npm start        # sirve la app compilada y la API en http://localhost:3001
```

## PWA

- `public/manifest.json` — nombre, colores, íconos y accesos directos.
- `public/sw.js` — Service Worker (caché de archivos base, imágenes, página sin conexión). Se registra en `src/main.jsx`.
- `public/offline.html` — se muestra si no hay conexión y la página no está en caché.
- `public/icons/` — íconos 192, 512 y maskable.

Para revisarla: DevTools → **Application** → *Manifest* y *Service Workers*.
Para simular sin conexión: pestaña **Network** → *Offline* y recarga.

## Imágenes

Ver `public/img/LEEME-IMAGENES.txt` para los nombres exactos.

## Librerías reutilizadas

- [lucide-react](https://lucide.dev) — íconos
- [react-hot-toast](https://react-hot-toast.com) — notificaciones
- [react-router-dom](https://reactrouter.com) — rutas
- [Express](https://expressjs.com) — servidor
- [concurrently](https://www.npmjs.com/package/concurrently) — ejecutar servidor y cliente juntos
- [Google Fonts](https://fonts.google.com) — Fredoka y Nunito
