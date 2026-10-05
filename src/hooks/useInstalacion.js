import { useEffect, useState } from 'react'

export function useInstalacion() {
  const [eventoInstalacion, setEventoInstalacion] = useState(null)
  const [instalada, setInstalada] = useState(
    window.matchMedia('(display-mode: standalone)').matches
  )

  useEffect(() => {
    const alOfrecerInstalacion = (evento) => {
      evento.preventDefault()
      setEventoInstalacion(evento)
    }
    const alInstalar = () => {
      setInstalada(true)
      setEventoInstalacion(null)
    }
    window.addEventListener('beforeinstallprompt', alOfrecerInstalacion)
    window.addEventListener('appinstalled', alInstalar)
    return () => {
      window.removeEventListener('beforeinstallprompt', alOfrecerInstalacion)
      window.removeEventListener('appinstalled', alInstalar)
    }
  }, [])

  const instalar = async () => {
    if (!eventoInstalacion) return
    eventoInstalacion.prompt()
    await eventoInstalacion.userChoice
    setEventoInstalacion(null)
  }

  return { puedeInstalar: Boolean(eventoInstalacion) && !instalada, instalar }
}
