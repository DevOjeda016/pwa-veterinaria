PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre           TEXT NOT NULL,
  correo           TEXT NOT NULL UNIQUE,
  contrasena_hash  TEXT NOT NULL,
  sal              TEXT NOT NULL,
  creado_en        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sesiones (
  token       TEXT PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS servicios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL UNIQUE,
  descripcion   TEXT NOT NULL,
  precio        REAL NOT NULL DEFAULT 0,
  duracion_min  INTEGER NOT NULL DEFAULT 30,
  imagen        TEXT
);

CREATE TABLE IF NOT EXISTS mascotas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  especie     TEXT NOT NULL CHECK (especie IN ('perro','gato','ave','conejo','otro')),
  raza        TEXT,
  edad        INTEGER CHECK (edad >= 0),
  peso        REAL CHECK (peso >= 0),
  notas       TEXT,
  creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS citas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id   INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mascota_id   INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
  servicio_id  INTEGER REFERENCES servicios(id) ON DELETE SET NULL,
  fecha        TEXT NOT NULL,
  hora         TEXT NOT NULL,
  motivo       TEXT,
  estado       TEXT NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente','confirmada','completada','cancelada')),
  creado_en    TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO servicios (nombre, descripcion, precio, duracion_min, imagen) VALUES
  ('Consulta general',    'Revisión completa del estado de salud de tu mascota, diagnóstico y tratamiento.', 350, 30, '/img/servicio-consulta.jpg'),
  ('Vacunación',          'Esquema de vacunas para perros y gatos: rabia, parvovirus, moquillo, triple felina y más.', 280, 20, '/img/servicio-vacunacion.jpg'),
  ('Cirugía',             'Esterilizaciones y cirugías de tejidos blandos con anestesia segura y monitoreo.', 1800, 120, '/img/servicio-cirugia.jpg'),
  ('Estética canina',     'Baño, corte de pelo, limpieza de oídos y corte de uñas con productos hipoalergénicos.', 300, 60, '/img/servicio-estetica.jpg'),
  ('Laboratorio clínico', 'Análisis de sangre, orina y coproparasitoscópicos con resultados el mismo día.', 450, 30, '/img/servicio-laboratorio.jpg'),
  ('Urgencias 24/7',      'Atención inmediata ante accidentes, intoxicaciones o cualquier emergencia.', 600, 45, '/img/servicio-urgencias.jpg');
