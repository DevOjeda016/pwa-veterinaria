import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function DisenoAuth({ titulo, subtitulo, children }) {
  return (
    <div className="auth">
      <div className="auth__box">
        <Link to="/">Volver al inicio</Link>
        <Logo />
        <h1>{titulo}</h1>
        <p className="muted">{subtitulo}</p>
        {children}
      </div>
    </div>
  )
}
