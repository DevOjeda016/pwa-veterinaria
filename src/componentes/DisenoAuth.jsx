import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from './Logo'
import ImagenSegura from './ImagenSegura'

export default function DisenoAuth({ titulo, subtitulo, imagen, children }) {
  return (
    <div className="auth">
      <div className="auth__media">
        <ImagenSegura ruta={imagen} texto="Mascota feliz" clase="auth__img" />
        <div className="auth__overlay">
          <h2>Su salud, nuestra pasión 💚</h2>
          <p>Más de 5,000 mascotas felices confían en nosotros.</p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__box">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Volver al inicio</Link>
          <Logo />
          <h1>{titulo}</h1>
          <p className="muted">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
