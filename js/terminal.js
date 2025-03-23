/**
 * terminal.js - Implementa la pantalla de bienvenida estilo terminal
 * Versión: 3.1.0
 * Fusión de: terminal.js + terminal-preload.js + terminal-navigation.js
 */

// Ocultar el contenido principal inmediatamente
document.documentElement.style.visibility = "hidden"
// IIFE para encapsular la funcionalidad de la terminal
;(() => {
  //
  // SECCIÓN 1: NAVEGACIÓN Y LÓGICA DE VISUALIZACIÓN
  //

  // Función para detectar si la página está siendo recargada o es una visita inicial
  function shouldShowTerminal() {
    // Obtener el tipo de navegación
    const navigationType = getNavigationType()

    // Obtener la URL anterior (referrer)
    const referrer = document.referrer
    const currentHost = window.location.hostname

    // Determinar si es una navegación interna (de una página a otra dentro del mismo sitio)
    const isInternalNavigation = referrer && referrer.includes(currentHost)

    // Determinar si es una recarga de página
    const isReload = navigationType === "reload"

    // Determinar si es una entrada directa (sin referrer o desde otro dominio)
    const isDirectEntry = !isInternalNavigation && (navigationType === "navigate" || navigationType === "direct")

    // Mostrar la terminal SOLO si:
    // 1. Es una recarga de página (F5 o Ctrl+R)
    // 2. Es una entrada directa al sitio (URL directa o desde otro dominio)
    const shouldShow = isReload || isDirectEntry

    // Si vamos a mostrar la terminal, actualizar el timestamp
    if (shouldShow) {
      sessionStorage.setItem("lastTerminalTimestamp", Date.now().toString())
    }

    return shouldShow
  }

  // Función para determinar el tipo de navegación
  function getNavigationType() {
    // Usar la API de Navigation Timing si está disponible
    if (window.performance && window.performance.navigation) {
      const navType = window.performance.navigation.type

      // 0 es navegación directa, 1 es recarga, 2 es navegación atrás/adelante
      if (navType === 0) return "navigate"
      if (navType === 1) return "reload"
      if (navType === 2) return "back_forward"
      return "unknown"
    }
    // Usar la API más moderna si está disponible
    else if (
      window.performance &&
      window.performance.getEntriesByType &&
      window.performance.getEntriesByType("navigation").length
    ) {
      return window.performance.getEntriesByType("navigation")[0].type
    }
    // Fallback: usar un enfoque basado en referrer
    else {
      // Si no hay referrer o el referrer es de otro dominio, considerarlo como navegación directa
      const referrer = document.referrer
      const currentHost = window.location.hostname

      if (!referrer || !referrer.includes(currentHost)) {
        return "direct"
      }

      // Si el referrer es del mismo dominio, considerarlo como navegación interna
      return "back_forward"
    }
  }

  //
  // SECCIÓN 2: PRELOAD Y VISIBILIDAD DEL LOGO
  //

  // Función para asegurar la visibilidad del logo después de que la terminal se cierre
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

  //
  // SECCIÓN 3: IMPLEMENTACIÓN DE LA TERMINAL
  //

  // Variable para almacenar la referencia al overlay de la terminal
  let terminalOverlayRef = null

  // Variable para almacenar el estado de las teclas presionadas
  const keyState = {
    alt: false,
    t: false,
  }

  // Función para cerrar la terminal
  function closeTerminal() {
    if (!terminalOverlayRef) return

    terminalOverlayRef.classList.add("terminal-exit")

    // Eliminar overlay y restaurar desplazamiento después de la animación
    setTimeout(() => {
      document.body.removeChild(terminalOverlayRef)
      document.body.style.overflow = ""

      // Mostrar el contenido principal
      document.documentElement.style.visibility = "visible"
      document.body.classList.add("terminal-ready")

      // Limpiar la referencia
      terminalOverlayRef = null
    }, 1000)
  }

  // Función para manejar atajos de teclado
  function handleKeyDown(e) {
    // Actualizar estado de teclas
    if (e.key === "Alt") keyState.alt = true
    if (e.key.toLowerCase() === "t") keyState.t = true

    // Verificar si se presionó Alt+T
    if (keyState.alt && keyState.t && terminalOverlayRef) {
      e.preventDefault()
      closeTerminal()
    }
  }

  function handleKeyUp(e) {
    // Actualizar estado de teclas
    if (e.key === "Alt") keyState.alt = false
    if (e.key.toLowerCase() === "t") keyState.t = false
  }

  // Función para mostrar la terminal
  function showTerminal() {
    // Create terminal overlay
    const terminalOverlay = document.createElement("div")
    terminalOverlay.className = "terminal-overlay"
    terminalOverlay.setAttribute("role", "dialog")
    terminalOverlay.setAttribute("aria-label", "Terminal de bienvenida")

    // Guardar referencia global
    terminalOverlayRef = terminalOverlay

    // Create terminal container
    const terminalContainer = document.createElement("div")
    terminalContainer.className = "terminal-container"

    // Create terminal lines
    const line1 = document.createElement("p")
    line1.className = "terminal-line"
    line1.textContent = "Inicializando sistema..."

    const line2 = document.createElement("p")
    line2.className = "terminal-line"
    line2.textContent = "Autenticando usuario..."

    const line3 = document.createElement("p")
    line3.className = "terminal-line"
    line3.textContent = "Verificando acceso..."

    // Create access granted message
    const accessGranted = document.createElement("div")
    accessGranted.className = "terminal-access"
    accessGranted.textContent = "Acceso concedido."

    // Create click to enter message
    const clickToEnter = document.createElement("div")
    clickToEnter.className = "terminal-click"
    clickToEnter.textContent = "[ Hacer clic para ingresar ]"

    // Append elements to container
    terminalContainer.appendChild(line1)
    terminalContainer.appendChild(line2)
    terminalContainer.appendChild(line3)
    terminalContainer.appendChild(accessGranted)
    terminalContainer.appendChild(clickToEnter)

    // Append container to overlay
    terminalOverlay.appendChild(terminalContainer)

    // Append overlay to body
    document.body.appendChild(terminalOverlay)

    // Prevent scrolling while terminal is active
    document.body.style.overflow = "hidden"

    // Agregar event listeners para atajos de teclado
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    // Animation sequence
    setTimeout(() => {
      line1.classList.add("visible")

      setTimeout(() => {
        line1.classList.remove("visible")

        setTimeout(() => {
          line2.classList.add("visible")

          setTimeout(() => {
            line2.classList.remove("visible")

            setTimeout(() => {
              line3.classList.add("visible")

              setTimeout(() => {
                line3.classList.remove("visible")

                setTimeout(() => {
                  accessGranted.classList.add("visible")

                  setTimeout(() => {
                    clickToEnter.classList.add("visible")
                  }, 1000)
                }, 500)
              }, 1500)
            }, 300)
          }, 1500)
        }, 300)
      }, 1500)
    }, 500)

    // Handle click to enter
    terminalOverlay.addEventListener("click", () => {
      // Only proceed if the click to enter message is visible
      if (clickToEnter.classList.contains("visible")) {
        closeTerminal()
      }
    })
  }

  // Inicializar la terminal
  document.addEventListener("DOMContentLoaded", () => {
    // Iniciar la función para asegurar la visibilidad del logo
    ensureLogoVisibility()

    // Verificar si debemos mostrar la terminal
    if (shouldShowTerminal()) {
      // Crear y mostrar la terminal
      showTerminal()
    } else {
      // Si no mostramos la terminal, asegurarnos de que el contenido sea visible
      document.documentElement.style.visibility = "visible"
      document.body.classList.add("terminal-ready")
    }
  })

  // Exponer la función para que pueda ser usada por otros scripts
  window.shouldShowTerminal = shouldShowTerminal
})()

