import { Bird, Cat, Dog, PawPrint, Rabbit } from 'lucide-react'

export const ESPECIES = {
  perro: { etiqueta: 'Perro', icono: Dog, imagen: '/img/mascota-perro.jpg' },
  gato: { etiqueta: 'Gato', icono: Cat, imagen: '/img/mascota-gato.jpg' },
  ave: { etiqueta: 'Ave', icono: Bird, imagen: '/img/mascota-ave.jpg' },
  conejo: { etiqueta: 'Conejo', icono: Rabbit, imagen: '/img/mascota-conejo.jpg' },
  otro: { etiqueta: 'Otro', icono: PawPrint, imagen: '/img/mascota-otro.jpg' },
}

export const ESTADOS_CITA = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export const formatoPrecio = (cantidad) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cantidad ?? 0)
