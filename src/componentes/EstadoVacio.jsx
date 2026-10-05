export default function EstadoVacio({ icono: Icono, titulo, texto, children }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icono size={40} />
      </div>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {children}
    </div>
  )
}
