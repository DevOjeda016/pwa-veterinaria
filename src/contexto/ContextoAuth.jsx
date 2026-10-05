import { createContext, useContext, useEffect, useState } from 'react'
import { api, guardarSesion, leerSesion } from '../api/cliente'

const ContextoAuth = createContext(null)

export function ProveedorAuth({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  const actualizarSesion = (nuevaSesion) => {
    guardarSesion(nuevaSesion)
    setSesion(nuevaSesion)
  }

  useEffect(() => {
    const alExpirar = () => actualizarSesion(null)
    window.addEventListener('sesion-expirada', alExpirar)
    if (leerSesion()) api('/auth/yo').catch(() => {})
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  const login = async (correo, contrasena) => {
    const nuevaSesion = await api('/auth/login', { metodo: 'POST', cuerpo: { correo, contrasena } })
    actualizarSesion(nuevaSesion)
  }

  const registro = async (nombre, correo, contrasena) => {
    const nuevaSesion = await api('/auth/registro', { metodo: 'POST', cuerpo: { nombre, correo, contrasena } })
    actualizarSesion(nuevaSesion)
  }

  const logout = async () => {
    await api('/auth/logout', { metodo: 'POST' }).catch(() => {})
    actualizarSesion(null)
  }

  const usuario = sesion?.usuario ?? null

  return (
    <ContextoAuth.Provider value={{ sesion, usuario, nombre: usuario?.nombre ?? '', login, registro, logout }}>
      {children}
    </ContextoAuth.Provider>
  )
}

export const useAuth = () => useContext(ContextoAuth)
