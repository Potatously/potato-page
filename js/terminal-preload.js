// Este script se ejecuta antes de que se cargue el DOM
// Oculta el contenido principal inmediatamente
document.documentElement.style.visibility = "hidden"

// Crear un estilo para asegurar que solo la terminal sea visible
const style = document.createElement("style")
style.textContent = `
  body { visibility: hidden; }
  .terminal-overlay { visibility: visible !important; }
`
document.head.appendChild(style)