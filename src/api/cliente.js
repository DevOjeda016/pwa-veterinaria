const CLAVE_SESION = 'huellitas-sesion'

export const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export const guardarSesion = (sesion) => {
  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  else localStorage.removeItem(CLAVE_SESION)
}

export async function api(ruta, { metodo = 'GET', cuerpo } = {}) {
  const sesion = leerSesion()
  const encabezados = { 'Content-Type': 'application/json' }
  if (sesion?.token) encabezados.Authorization = `Bearer ${sesion.token}`

  let respuesta
  try {
    respuesta = await fetch(`/api${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const datos = await respuesta.json().catch(() => null)

  if (respuesta.status === 401 && sesion?.token) {
    window.dispatchEvent(new Event('sesion-expirada'))
  }
  if (!respuesta.ok) throw new Error(datos?.error || 'Error en el servidor')
  return datos
}
