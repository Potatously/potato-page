/**
 * format-detector.js - Detecta el soporte de formatos de imagen modernos
 * Versión: 2.1.0
 */

// Función para detectar soporte de formatos de imagen
function detectImageSupport() {
  return new Promise((resolve) => {
    const support = {
      avif: false,
      webp: false,
    }

    // Detectar AVIF support
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

    // Función para verificar soporte de WebP
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

// Función para detectar soporte de formatos de video
function detectVideoSupport() {
  const support = {
    webm: false,
    mp4: true, // MP4 es ampliamente soportado, asumimos true por defecto
  }

  const video = document.createElement("video")

  // Verificar soporte de WebM
  support.webm = video.canPlayType('video/webm; codecs="vp8, vorbis"') !== ""

  // Guardar el soporte detectado en window para uso global
  window.videoFormatSupport = support

  return support
}

// Función para actualizar las fuentes del logo basado en el tema y soporte de formatos
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
    if (support && support.avif) {
      logoSrc = "./assets/images/patata-blanca.avif"
    } else if (support && support.webp) {
      logoSrc = "./assets/images/patata-blanca.webp"
    } else {
      logoSrc = "./assets/images/patata-blanca.png"
    }
  } else {
    // Modo claro - usar patata negra
    if (support && support.avif) {
      logoSrc = "./assets/images/papa-negra.avif"
    } else if (support && support.webp) {
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
    logoImage.src =
      theme === "dark" ? "./assets/images/fallback-logo-dark.png" : "./assets/images/fallback-logo-light.png"
  }

  tempImg.src = logoSrc
}

// Inicializar detección de formatos al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  // Detectar soporte de formatos de imagen
  detectImageSupport().then((support) => {
    // Detectar soporte de formatos de video
    detectVideoSupport()

    // Actualizar el logo con el formato adecuado
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
    // IMPORTANTE: Evitar recursión infinita asegurando que no se llame a sí misma
    window.updateLogoSources = () => {
      // Llamar directamente a la función local con el soporte detectado
      if (window.formatSupport) {
        updateLogoSources(window.formatSupport)
      }
    }

    // Exponer función para actualizar medios según el tema
    window.updateMediaSourcesForTheme = (theme) => {
      // Evitar llamar a updateLogoSources para prevenir recursión
      const isDark = theme === "dark-mode"

      const logoImage = document.getElementById("logo-image")
      if (!logoImage) return

      // Usar la misma lógica pero sin llamar a updateLogoSources
      let logoSrc = ""

      if (isDark) {
        // Modo oscuro - usar patata blanca
        if (window.formatSupport && window.formatSupport.avif) {
          logoSrc = "./assets/images/patata-blanca.avif"
        } else if (window.formatSupport && window.formatSupport.webp) {
          logoSrc = "./assets/images/patata-blanca.webp"
        } else {
          logoSrc = "./assets/images/patata-blanca.png"
        }
      } else {
        // Modo claro - usar patata negra
        if (window.formatSupport && window.formatSupport.avif) {
          logoSrc = "./assets/images/papa-negra.avif"
        } else if (window.formatSupport && window.formatSupport.webp) {
          logoSrc = "./assets/images/papa-negra.webp"
        } else {
          logoSrc = "./assets/images/papa-negra.png"
        }
      }

      // Verificar que la imagen existe antes de asignarla
      const tempImg = new Image()
      tempImg.onload = () => {
        logoImage.src = logoSrc
      }

      tempImg.onerror = () => {
        console.error("Error al cargar la imagen:", logoSrc)
        logoImage.src = isDark ? "./assets/images/fallback-logo-dark.png" : "./assets/images/fallback-logo-light.png"
      }

      tempImg.src = logoSrc
    }
  })
})

