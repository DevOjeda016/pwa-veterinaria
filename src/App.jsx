import { Navigate, Route, Routes } from 'react-router-dom'
import RutaProtegida from './componentes/RutaProtegida'
import DisenoPanel from './componentes/DisenoPanel'
import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Mascotas from './paginas/Mascotas'
import Citas from './paginas/Citas'
import Servicios from './paginas/Servicios'
import NoEncontrada from './paginas/NoEncontrada'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/app"
        element={
          <RutaProtegida>
            <DisenoPanel />
          </RutaProtegida>
        }
      >
        <Route index element={<Navigate to="mascotas" replace />} />
        <Route path="mascotas" element={<Mascotas />} />
        <Route path="citas" element={<Citas />} />
        <Route path="servicios" element={<Servicios />} />
      </Route>

      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}
