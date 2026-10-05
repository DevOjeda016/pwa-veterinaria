import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Ambulance, ArrowRight, CalendarCheck, CircleCheck, Clock, Download, HeartPulse, Mail, MapPin,
  Menu, Microscope, Phone, Scissors, ShieldCheck, Star, Stethoscope, Syringe, X,
} from 'lucide-react'
import Logo from '../componentes/Logo'
import ImagenSegura from '../componentes/ImagenSegura'
import { useAuth } from '../contexto/ContextoAuth'
import { useInstalacion } from '../hooks/useInstalacion'

const servicios = [
  { icono: Stethoscope, titulo: 'Consulta general', texto: 'Revisión completa, diagnóstico y tratamiento personalizado.', imagen: '/img/servicio-consulta.jpg' },
  { icono: Syringe, titulo: 'Vacunación', texto: 'Esquemas completos para cachorros, gatitos y adultos.', imagen: '/img/servicio-vacunacion.jpg' },
  { icono: HeartPulse, titulo: 'Cirugía', texto: 'Esterilizaciones y cirugías con anestesia monitoreada.', imagen: '/img/servicio-cirugia.jpg' },
  { icono: Scissors, titulo: 'Estética', texto: 'Baño, corte y spa con productos hipoalergénicos.', imagen: '/img/servicio-estetica.jpg' },
  { icono: Microscope, titulo: 'Laboratorio', texto: 'Análisis clínicos con resultados el mismo día.', imagen: '/img/servicio-laboratorio.jpg' },
  { icono: Ambulance, titulo: 'Urgencias 24/7', texto: 'Atención inmediata cuando más lo necesitas.', imagen: '/img/servicio-urgencias.jpg' },
]

const equipo = [
  { nombre: 'Dra. Mariana López', puesto: 'Medicina general', imagen: '/img/equipo-1.jpg' },
  { nombre: 'Dr. Carlos Ruiz', puesto: 'Cirujano veterinario', imagen: '/img/equipo-2.jpg' },
  { nombre: 'Dra. Sofía Méndez', puesto: 'Especialista en felinos', imagen: '/img/equipo-3.jpg' },
]

const testimonios = [
  { nombre: 'Andrea G.', mascota: 'Dueña de Max 🐶', texto: 'Atendieron a Max de urgencia a medianoche. Súper amables y profesionales.' },
  { nombre: 'Luis P.', mascota: 'Dueño de Michi 🐱', texto: 'Agendar citas desde el celular es facilísimo. Me encanta la app.' },
  { nombre: 'Fernanda R.', mascota: 'Dueña de Kiwi 🦜', texto: 'Encontré especialistas en aves, cosa que es muy difícil. ¡Recomendadísimos!' },
]

export default function Inicio() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { sesion } = useAuth()
  const { puedeInstalar, instalar } = useInstalacion()
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <div className="landing">
      <header className="navbar">
        <div className="container navbar__inner">
          <Logo />
          <nav className={`navbar__links ${menuAbierto ? 'is-open' : ''}`}>
            <a href="#servicios" onClick={cerrarMenu}>Servicios</a>
            <a href="#nosotros" onClick={cerrarMenu}>Nosotros</a>
            <a href="#equipo" onClick={cerrarMenu}>Equipo</a>
            <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
            {puedeInstalar && (
              <button className="btn btn--outline btn--sm" onClick={instalar}>
                <Download size={16} /> Instalar app
              </button>
            )}
            {sesion ? (
              <Link to="/app" className="btn btn--primary btn--sm">Ir a mi panel</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn--primary btn--sm">Crear cuenta</Link>
              </>
            )}
          </nav>
          <button className="icon-btn navbar__toggle" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
            {menuAbierto ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="pill"><ShieldCheck size={16} /> Clínica certificada desde 2010</span>
            <h1>
              Cuidamos a quien <span className="text-accent">más quieres</span> 🐾
            </h1>
            <p>
              Medicina veterinaria con cariño y tecnología. Registra a tus mascotas, agenda citas en
              segundos y lleva su historial siempre contigo, incluso sin conexión.
            </p>
            <div className="hero__actions">
              <Link to={sesion ? '/app/citas' : '/registro'} className="btn btn--primary btn--lg">
                Agendar una cita <ArrowRight size={18} />
              </Link>
              <a href="#servicios" className="btn btn--ghost btn--lg">Ver servicios</a>
            </div>
            <div className="hero__stats">
              <div><strong>+5,000</strong><span>mascotas atendidas</span></div>
              <div><strong>24/7</strong><span>urgencias</span></div>
              <div><strong>4.9 ★</strong><span>calificación</span></div>
            </div>
          </div>
          <div className="hero__media">
            <div className="hero__blob" />
            <ImagenSegura ruta="/img/hero-veterinaria.jpg" texto="Veterinaria atendiendo a un perro" clase="hero__img" />
            <div className="float-card float-card--top">
              <CalendarCheck size={22} className="text-primary" />
              <div><strong>Cita confirmada</strong><small>Hoy · 10:30 a. m.</small></div>
            </div>
            <div className="float-card float-card--bottom">
              <HeartPulse size={22} className="text-accent" />
              <div><strong>Max está sano</strong><small>Vacunas al día ✔</small></div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Nuestros servicios</span>
            <h2>Todo lo que tu mascota necesita, en un solo lugar</h2>
          </div>
          <div className="grid grid--3">
            {servicios.map(({ icono: Icono, titulo, texto, imagen }) => (
              <article key={titulo} className="service-card">
                <ImagenSegura ruta={imagen} texto={titulo} icono={Icono} clase="service-card__img" />
                <div className="service-card__body">
                  <span className="service-card__icon"><Icono size={22} /></span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="section section--soft">
        <div className="container split">
          <ImagenSegura ruta="/img/nosotros.jpg" texto="Instalaciones de la clínica" clase="split__img" />
          <div>
            <span className="eyebrow">¿Por qué elegirnos?</span>
            <h2>Más de 15 años cuidando familias de cuatro patas</h2>
            <p className="muted">
              En HuellitasVet combinamos experiencia médica con un trato cálido. Nuestras instalaciones
              cuentan con quirófano, laboratorio propio y área de hospitalización.
            </p>
            <ul className="checklist">
              <li><CircleCheck size={20} /> Veterinarios certificados y en constante capacitación</li>
              <li><CircleCheck size={20} /> Historial clínico digital de cada mascota</li>
              <li><CircleCheck size={20} /> Recordatorios de vacunas y citas</li>
              <li><CircleCheck size={20} /> Precios transparentes, sin sorpresas</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="equipo" className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Nuestro equipo</span>
            <h2>Especialistas que aman a los animales</h2>
          </div>
          <div className="grid grid--3">
            {equipo.map((integrante) => (
              <article key={integrante.nombre} className="team-card">
                <ImagenSegura ruta={integrante.imagen} texto={integrante.nombre} icono={Stethoscope} clase="team-card__img" />
                <h3>{integrante.nombre}</h3>
                <p className="muted">{integrante.puesto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Testimonios</span>
            <h2>Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid grid--3">
            {testimonios.map((testimonio) => (
              <blockquote key={testimonio.nombre} className="testimonial">
                <div className="stars">
                  {[...Array(5)].map((_, indice) => <Star key={indice} size={16} fill="currentColor" />)}
                </div>
                <p>“{testimonio.texto}”</p>
                <footer><strong>{testimonio.nombre}</strong><span>{testimonio.mascota}</span></footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>¿Listo para la primera cita?</h2>
              <p>Crea tu cuenta gratis, registra a tu mascota y agenda en menos de un minuto.</p>
            </div>
            <Link to={sesion ? '/app/citas' : '/registro'} className="btn btn--white btn--lg">
              Comenzar ahora <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer id="contacto" className="footer">
        <div className="container footer__grid">
          <div>
            <Logo claro />
            <p>Clínica veterinaria integral. Cuidamos la salud y felicidad de tu mejor amigo.</p>
          </div>
          <div>
            <h4>Contacto</h4>
            <p><Phone size={16} /> (55) 1234 5678</p>
            <p><Mail size={16} /> contacto@huellitasvet.com</p>
            <p><MapPin size={16} /> Av. de las Mascotas 123, CDMX</p>
          </div>
          <div>
            <h4>Horario</h4>
            <p><Clock size={16} /> Lun a Sáb: 9:00 – 20:00</p>
            <p><Clock size={16} /> Domingo: 10:00 – 14:00</p>
            <p><Ambulance size={16} /> Urgencias: 24/7</p>
          </div>
        </div>
        <div className="footer__bottom">© {new Date().getFullYear()} HuellitasVet · Todos los derechos reservados</div>
      </footer>
    </div>
  )
}
