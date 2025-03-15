document.addEventListener("DOMContentLoaded", () => {
  // Function to detect AVIF and WebP support
  function detectImageSupport() {
    return new Promise((resolve) => {
      const support = {
        avif: false,
        webp: false,
      }

      // Detect AVIF support
      const avif = new Image()
      avif.onload = () => {
        support.avif = true
        checkWebpSupport()
      }
      avif.onerror = () => {
        checkWebpSupport()
      }
      avif.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1pZjEAAABhbWV0YQAAAAhhaXZwYgEAAAAAogcAAAAAAHBtZHVyYXhwAAAAAAIAAAIAAAAUaGlsYwAAABwAAAAKAAAAAAFraW5mAAAAAAIAAAAVAAAAAA5tZGlhdgAgABAAAAAOcGlsbAAAAABJAAAAKAAAACNjb2xybmNseXAAAAAAChAAAAAAYXhwcnAAAABoAAAAIChjb2xybmNseXAIAAAAABAAAAAAeGlwcnAAAAAoAAAAgChjb2xybmNseWkAAAAABAAAAAAoaXNlbmMAAAABAAAAgYm1vdmUAAAAAAABtbWRhdAoAAAAAAAAAAAAAA"

      // Función checkWebpSupport
      function checkWebpSupport() {
        const webp = new Image()
        webp.onload = () => {
          support.webp = true
          // Guardar el soporte detectado en window para uso global
          window.formatSupport = support
          resolve(support)
        }
        webp.onerror = () => {
          // Guardar el soporte detectado en window para uso global
          window.formatSupport = support
          resolve(support)
        }
        // Usar una cadena base64 válida y completa para WebP
        webp.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="
      }
    })
  }

  // Function to update the logo source based on detected support and theme
  function updateLogoSources(support) {
    const logoImage = document.getElementById("logo-image")
    if (!logoImage) return
  
    // Determinar el tema actual de manera más robusta
    const isDarkMode =
      document.documentElement.classList.contains("dark-mode") ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !document.documentElement.classList.contains("light-mode"))
  
    // Definir el tema basado en las clases y preferencias del sistema
    const theme = isDarkMode ? "dark" : "light"
    
    // Definir las rutas de las imágenes
    let logoSrc = ""
  
    // Asignar la imagen correcta según el tema
    if (theme === "dark") {
      // Modo oscuro - usar patata blanca
      if (support.avif) {
        logoSrc = "./assets/images/patata-blanca.avif"
      } else if (support.webp) {
        logoSrc = "./assets/images/patata-blanca.webp"
      } else {
        logoSrc = "./assets/images/patata-blanca.png"
      }
    } else {
      // Modo claro - usar patata negra
      if (support.avif) {
        logoSrc = "./assets/images/papa-negra.avif"
      } else if (support.webp) {
        logoSrc = "./assets/images/papa-negra.webp"
      } else {
        logoSrc = "./assets/images/papa-negra.png"
      }
    }
    
    // Verificar que la imagen existe antes de asignarla
    const tempImg = new Image()
    tempImg.onload = () => {
      // La imagen existe, asignarla al logo
      logoImage.src = logoSrc
    }
  
    tempImg.onerror = () => {
      // La imagen no existe, usar una imagen de respaldo
      console.error("Error al cargar la imagen:", logoSrc)
      logoImage.src = theme === "dark" ? "./assets/images/fallback-logo-dark.png" : "./assets/images/fallback-logo-light.png"
    }
  
    tempImg.src = logoSrc
  }
  
  

  // Detect support and update logo
  detectImageSupport().then((support) => {
    updateLogoSources(support)

    // Configurar listener para el botón de cambio de tema
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        // Usar un tiempo más largo para asegurar que el tema se haya aplicado
        setTimeout(() => updateLogoSources(support), 100)
      })
    }

    // Configurar listener para cambios en el esquema de colores del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", () => {
      // Verificar si no hay clases de tema explícitas
      if (
        !document.documentElement.classList.contains("light-mode") &&
        !document.documentElement.classList.contains("dark-mode")
      ) {
        setTimeout(() => updateLogoSources(support), 100)
      }
    })

    // Exponer la función para que otros scripts puedan usarla
    window.updateLogoSources = () => updateLogoSources(support)
  })
})

