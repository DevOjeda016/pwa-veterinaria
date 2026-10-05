import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { CalendarDays, LogOut, PawPrint, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexto/ContextoAuth'
import Logo from './Logo'

const enlaces = [
  { ruta: '/app/mascotas', texto: 'Mis mascotas', icono: PawPrint },
  { ruta: '/app/citas', texto: 'Mis citas', icono: CalendarDays },
  { ruta: '/app/servicios', texto: 'Servicios', icono: Stethoscope },
]

export default function DisenoPanel() {
  const { nombre, usuario, logout } = useAuth()
  const navegar = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    toast.success('Sesión cerrada. ¡Vuelve pronto! 🐾')
    navegar('/login', { replace: true })
  }

  return (
    <div className="dash">
      <aside className="sidebar">
        <Logo destino="/app" claro />

        <nav className="sidebar__nav">
          {enlaces.map(({ ruta, texto, icono: Icono }) => (
            <NavLink key={ruta} to={ruta} className="sidebar__link">
              <Icono size={20} />
              <span>{texto}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <div className="avatar">{nombre.charAt(0).toUpperCase()}</div>
          <div className="sidebar__user-info">
            <strong>{nombre}</strong>
            <small>{usuario?.correo}</small>
          </div>
        </div>
        <button className="btn btn--ghost-light btn--block" onClick={cerrarSesion}>
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      <header className="topbar">
        <Logo destino="/app" />
        <button className="icon-btn" onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOut size={20} />
        </button>
      </header>

      <main className="dash__main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {enlaces.map(({ ruta, texto, icono: Icono }) => (
          <NavLink key={ruta} to={ruta} className="bottom-nav__link">
            <Icono size={22} />
            <span>{texto.replace('Mis ', '')}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
