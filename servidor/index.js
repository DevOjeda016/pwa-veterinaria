import express from 'express'
import crypto from 'node:crypto'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { bd } from './bd.js'

const aplicacion = express()
const PUERTO = process.env.PUERTO || 3001
const carpetaDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

aplicacion.use(express.json())

const cifrarContrasena = (contrasena, sal = crypto.randomBytes(16).toString('hex')) => ({
  sal,
  hash: crypto.scryptSync(contrasena, sal, 64).toString('hex'),
})

const contrasenaValida = (contrasena, sal, hash) =>
  crypto.timingSafeEqual(Buffer.from(hash, 'hex'), crypto.scryptSync(contrasena, sal, 64))

const crearSesion = (usuario) => {
  const token = crypto.randomBytes(32).toString('hex')
  bd.prepare('INSERT INTO sesiones (token, usuario_id) VALUES (?, ?)').run(token, usuario.id)
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } }
}

function autenticar(peticion, respuesta, siguiente) {
  const token = peticion.headers.authorization?.replace('Bearer ', '')
  const usuario =
    token &&
    bd
      .prepare(
        `SELECT u.id, u.nombre, u.correo FROM sesiones s
         JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ?`
      )
      .get(token)

  if (!usuario) return respuesta.status(401).json({ error: 'Sesión no válida, inicia sesión de nuevo' })
  peticion.usuario = usuario
  peticion.token = token
  siguiente()
}

const textoOpcional = (valor) => (typeof valor === 'string' && valor.trim() ? valor.trim() : null)
const numeroOpcional = (valor) => (valor === '' || valor == null ? null : Number(valor))

aplicacion.post('/api/auth/registro', (peticion, respuesta) => {
  const { nombre, correo, contrasena } = peticion.body ?? {}
  if (!nombre?.trim() || !correo?.trim() || !contrasena) {
    return respuesta.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' })
  }
  if (contrasena.length < 6) {
    return respuesta.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
  }

  const correoNormalizado = correo.trim().toLowerCase()
  const existente = bd.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correoNormalizado)
  if (existente) return respuesta.status(409).json({ error: 'Ese correo ya está registrado' })

  const { sal, hash } = cifrarContrasena(contrasena)
  const resultado = bd
    .prepare('INSERT INTO usuarios (nombre, correo, contrasena_hash, sal) VALUES (?, ?, ?, ?)')
    .run(nombre.trim(), correoNormalizado, hash, sal)

  respuesta
    .status(201)
    .json(crearSesion({ id: resultado.lastInsertRowid, nombre: nombre.trim(), correo: correoNormalizado }))
})

aplicacion.post('/api/auth/login', (peticion, respuesta) => {
  const { correo, contrasena } = peticion.body ?? {}
  const usuario = bd.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo?.trim().toLowerCase() ?? '')

  if (!usuario || !contrasenaValida(contrasena ?? '', usuario.sal, usuario.contrasena_hash)) {
    return respuesta.status(401).json({ error: 'Correo o contraseña incorrectos' })
  }
  respuesta.json(crearSesion(usuario))
})

aplicacion.post('/api/auth/logout', autenticar, (peticion, respuesta) => {
  bd.prepare('DELETE FROM sesiones WHERE token = ?').run(peticion.token)
  respuesta.json({ ok: true })
})

aplicacion.get('/api/auth/yo', autenticar, (peticion, respuesta) => {
  respuesta.json(peticion.usuario)
})

aplicacion.get('/api/servicios', (_peticion, respuesta) => {
  respuesta.json(bd.prepare('SELECT * FROM servicios ORDER BY id').all())
})

aplicacion.get('/api/mascotas', autenticar, (peticion, respuesta) => {
  const mascotas = bd
    .prepare('SELECT * FROM mascotas WHERE usuario_id = ? ORDER BY creado_en DESC, id DESC')
    .all(peticion.usuario.id)
  respuesta.json(mascotas)
})

aplicacion.post('/api/mascotas', autenticar, (peticion, respuesta) => {
  const { nombre, especie, raza, edad, peso, notas } = peticion.body ?? {}
  if (!nombre?.trim()) return respuesta.status(400).json({ error: 'El nombre es obligatorio' })

  const resultado = bd
    .prepare(
      `INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(peticion.usuario.id, nombre.trim(), especie, textoOpcional(raza), numeroOpcional(edad), numeroOpcional(peso), textoOpcional(notas))

  respuesta.status(201).json(bd.prepare('SELECT * FROM mascotas WHERE id = ?').get(resultado.lastInsertRowid))
})

aplicacion.put('/api/mascotas/:id', autenticar, (peticion, respuesta) => {
  const { nombre, especie, raza, edad, peso, notas } = peticion.body ?? {}
  if (!nombre?.trim()) return respuesta.status(400).json({ error: 'El nombre es obligatorio' })

  const resultado = bd
    .prepare(
      `UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, notas = ?
       WHERE id = ? AND usuario_id = ?`
    )
    .run(nombre.trim(), especie, textoOpcional(raza), numeroOpcional(edad), numeroOpcional(peso), textoOpcional(notas), peticion.params.id, peticion.usuario.id)

  if (resultado.changes === 0) return respuesta.status(404).json({ error: 'Mascota no encontrada' })
  respuesta.json(bd.prepare('SELECT * FROM mascotas WHERE id = ?').get(peticion.params.id))
})

aplicacion.delete('/api/mascotas/:id', autenticar, (peticion, respuesta) => {
  const resultado = bd
    .prepare('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?')
    .run(peticion.params.id, peticion.usuario.id)
  if (resultado.changes === 0) return respuesta.status(404).json({ error: 'Mascota no encontrada' })
  respuesta.json({ ok: true })
})

aplicacion.get('/api/citas', autenticar, (peticion, respuesta) => {
  const citas = bd
    .prepare(
      `SELECT c.*,
              m.nombre  AS mascota_nombre,
              m.especie AS mascota_especie,
              s.nombre  AS servicio_nombre,
              s.precio  AS servicio_precio
       FROM citas c
       JOIN mascotas m ON m.id = c.mascota_id
       LEFT JOIN servicios s ON s.id = c.servicio_id
       WHERE c.usuario_id = ?
       ORDER BY c.fecha, c.hora`
    )
    .all(peticion.usuario.id)
  respuesta.json(citas)
})

aplicacion.post('/api/citas', autenticar, (peticion, respuesta) => {
  const { mascota_id, servicio_id, fecha, hora, motivo } = peticion.body ?? {}
  if (!mascota_id || !fecha || !hora) {
    return respuesta.status(400).json({ error: 'Mascota, fecha y hora son obligatorias' })
  }

  const mascota = bd
    .prepare('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?')
    .get(mascota_id, peticion.usuario.id)
  if (!mascota) return respuesta.status(404).json({ error: 'Mascota no encontrada' })

  const resultado = bd
    .prepare(
      `INSERT INTO citas (usuario_id, mascota_id, servicio_id, fecha, hora, motivo)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(peticion.usuario.id, mascota_id, numeroOpcional(servicio_id), fecha, hora, textoOpcional(motivo))

  respuesta.status(201).json({ id: resultado.lastInsertRowid })
})

aplicacion.patch('/api/citas/:id', autenticar, (peticion, respuesta) => {
  const resultado = bd
    .prepare('UPDATE citas SET estado = ? WHERE id = ? AND usuario_id = ?')
    .run(peticion.body?.estado, peticion.params.id, peticion.usuario.id)
  if (resultado.changes === 0) return respuesta.status(404).json({ error: 'Cita no encontrada' })
  respuesta.json({ ok: true })
})

aplicacion.delete('/api/citas/:id', autenticar, (peticion, respuesta) => {
  const resultado = bd
    .prepare('DELETE FROM citas WHERE id = ? AND usuario_id = ?')
    .run(peticion.params.id, peticion.usuario.id)
  if (resultado.changes === 0) return respuesta.status(404).json({ error: 'Cita no encontrada' })
  respuesta.json({ ok: true })
})

aplicacion.use('/api', (_peticion, respuesta) => {
  respuesta.status(404).json({ error: 'Ruta no encontrada' })
})

if (existsSync(carpetaDist)) {
  aplicacion.use(express.static(carpetaDist))
  aplicacion.use((_peticion, respuesta) => respuesta.sendFile(path.join(carpetaDist, 'index.html')))
}

aplicacion.use((error, _peticion, respuesta, _siguiente) => {
  console.error(error)
  const esRestriccion = error.code === 'ERR_SQLITE_ERROR' && /constraint/i.test(error.message)
  respuesta
    .status(esRestriccion ? 400 : 500)
    .json({ error: esRestriccion ? 'Datos no válidos' : 'Error interno del servidor' })
})

aplicacion.listen(PUERTO, () => {
  console.log(`Servidor de HuellitasVet en http://localhost:${PUERTO}`)
})
