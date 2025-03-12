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
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            resolve(true)
          }
          img.onerror = () => {
            resolve(false)
          }
          // Usar una cadena base64 válida y completa para WebP
          img.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="
        })
      }
    })
  }

  // Function to update the logo source based on detected support and theme
  function updateLogoSources(support) {
    const logoImage = document.getElementById("logo-image")
    if (!logoImage) return

    // Determinar el tema actual de manera más robusta
    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const hasLightClass = document.documentElement.classList.contains("light-mode")
    const hasDarkClass = document.documentElement.classList.contains("dark-mode")

    // Lógica más explícita para determinar el tema
    let theme = "dark" // valor por defecto

    if (hasLightClass) {
      theme = "light"
    } else if (hasDarkClass) {
      theme = "dark"
    } else if (!isDarkMode) {
      theme = "light"
    }

    console.log("Tema actual detectado:", theme)

    // Definir las rutas de las imágenes
    let logoSrc = ""

    // CORRECCIÓN: Invertir la lógica para asignar correctamente los logos
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
        logoSrc = "./assets/images/patata-negra.avif"
      } else if (support.webp) {
        logoSrc = "./assets/images/patata-negra.webp"
      } else {
        logoSrc = "./assets/images/patata-negra.png"
      }
    }

    console.log("Asignando logo:", logoSrc)

    // Verificar que la imagen existe antes de asignarla
    const tempImg = new Image()
    tempImg.onload = () => {
      // La imagen existe, asignarla al logo
      logoImage.src = logoSrc
      // Forzar recarga de la imagen
      logoImage.style.display = "none"
      setTimeout(() => {
        logoImage.style.display = ""
      }, 10)
    }

    tempImg.onerror = () => {
      // La imagen no existe, usar una imagen de respaldo
      console.error("Error al cargar la imagen:", logoSrc)
      logoImage.src = theme === "dark" ? "./assets/images/patata-blanca.png" : "./assets/images/patata-negra.png"
    }

    tempImg.src = logoSrc

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
  }

  // Detect support and update logo
  detectImageSupport().then((support) => {
    updateLogoSources(support)
  })
})

