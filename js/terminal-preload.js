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
              // Si existe la función global de actualización del logo, usarla
              if (window.updateLogoSources) {
                window.updateLogoSources()
              } else if (window.formatSupport) {
                // Determinar el tema actual
                const isDarkMode =
                  document.documentElement.classList.contains("dark-mode") ||
                  (window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches &&
                    !document.documentElement.classList.contains("light-mode"))

                const theme = isDarkMode ? "dark-mode" : "light-mode"

                // Si existe la función de actualización en script.js, usarla
                if (window.updateMediaSourcesForTheme) {
                  window.updateMediaSourcesForTheme(theme)
                }
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

