import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

export default function Logo({ destino = '/', claro = false }) {
  return (
    <Link to={destino} className={`logo ${claro ? 'logo--claro' : ''}`}>
      <span className="logo__icon">
        <PawPrint size={22} />
      </span>
      <span>
        Huellitas<strong>Vet</strong>
      </span>
    </Link>
  )
}
