// Función para asegurar que el logo se cargue correctamente después de la terminal
function ensureLogoVisibility() {
  // Esperar a que el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    // Observar cambios en el DOM para detectar cuando se elimina la terminal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          // Verificar si la terminal fue eliminada
          const terminalRemoved = Array.from(mutation.removedNodes).some(
            (node) => node.classList && node.classList.contains("terminal-overlay"),
          )

          if (terminalRemoved) {
            // Recargar el logo después de que la terminal se cierre
            setTimeout(() => {
              const logoImage = document.getElementById("logo-image")
              if (logoImage) {
                // Determinar el tema actual
                const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                const hasLightClass = document.documentElement.classList.contains("light-mode")
                const hasDarkClass = document.documentElement.classList.contains("dark-mode")

                let theme = "dark" // valor por defecto

                if (hasLightClass) {
                  theme = "light"
                } else if (hasDarkClass) {
                  theme = "dark"
                } else if (!isDarkMode) {
                  theme = "light"
                }

                // Asignar la imagen correcta según el tema
                logoImage.src =
                  theme === "light" ? "./assets/images/patata-negra.png" : "./assets/images/patata-blanca.png"

                // Forzar recarga de la imagen
                logoImage.style.display = "none"
                setTimeout(() => {
                  logoImage.style.display = ""
                }, 10)
              }
            }, 200)
          }
        }
      })
    })

    // Configurar el observador
    observer.observe(document.body, { childList: true })
  })
}

// Ejecutar la función
ensureLogoVisibility()