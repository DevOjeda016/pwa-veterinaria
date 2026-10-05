import { useState } from 'react'
import { PawPrint } from 'lucide-react'

export default function ImagenSegura({ ruta, texto, clase = '', icono: Icono = PawPrint }) {
  const [fallo, setFallo] = useState(!ruta)

  if (fallo) {
    return (
      <div className={`smart-img smart-img--fallback ${clase}`} role="img" aria-label={texto}>
        <Icono size={48} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <img
      src={ruta}
      alt={texto}
      loading="lazy"
      className={`smart-img ${clase}`}
      onError={() => setFallo(true)}
    />
  )
}
