import { PawPrint } from 'lucide-react'

export default function Cargador({ pantallaCompleta = false, texto = 'Cargando...' }) {
  return (
    <div className={pantallaCompleta ? 'loader loader--full' : 'loader'}>
      <PawPrint className="loader__icon" size={36} />
      <span>{texto}</span>
    </div>
  )
}
