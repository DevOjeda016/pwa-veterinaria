import { Link } from 'react-router-dom'
import { Dog } from 'lucide-react'
import EstadoVacio from '../componentes/EstadoVacio'

export default function NoEncontrada() {
  return (
    <div className="center-page">
      <EstadoVacio icono={Dog} titulo="Página no encontrada (404)" texto="Parece que esta página salió a pasear y no regresó.">
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </EstadoVacio>
    </div>
  )
}
