import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import DisenoAuth from '../componentes/DisenoAuth'
import { useAuth } from '../contexto/ContextoAuth'

export default function Login() {
  const { login, sesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [formulario, setFormulario] = useState({ correo: '', contrasena: '' })
  const [verContrasena, setVerContrasena] = useState(false)
  const [enviando, setEnviando] = useState(false)

  if (sesion) return <Navigate to="/app" replace />

  const alCambiar = (evento) => setFormulario({ ...formulario, [evento.target.name]: evento.target.value })

  const alEnviar = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    try {
      await login(formulario.correo, formulario.contrasena)
      toast.success('¡Bienvenido de nuevo! 🐶')
      navegar(ubicacion.state?.desde || '/app', { replace: true })
    } catch (error) {
      toast.error(error.message)
      setEnviando(false)
    }
  }

  return (
    <DisenoAuth titulo="Iniciar sesión" subtitulo="Accede para ver a tus mascotas y tus citas." imagen="/img/login.jpg">
      <form className="form" onSubmit={alEnviar}>
        <label className="field">
          <span>Correo electrónico</span>
          <div className="input-icon">
            <Mail size={18} />
            <input type="email" name="correo" placeholder="tu@correo.com" value={formulario.correo} onChange={alCambiar} required autoComplete="email" />
          </div>
        </label>

        <label className="field">
          <span>Contraseña</span>
          <div className="input-icon">
            <Lock size={18} />
            <input type={verContrasena ? 'text' : 'password'} name="contrasena" placeholder="••••••••" value={formulario.contrasena} onChange={alCambiar} required autoComplete="current-password" />
            <button type="button" className="input-icon__btn" onClick={() => setVerContrasena(!verContrasena)} aria-label="Mostrar contraseña">
              {verContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button className="btn btn--primary btn--block btn--lg" disabled={enviando}>
          <LogIn size={18} /> {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth__switch">
        ¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link>
      </p>
    </DisenoAuth>
  )
}
