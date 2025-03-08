/**
 * Detector de Formatos Multimedia
 * Este script detecta la compatibilidad del navegador con diferentes formatos
 * y actualiza dinámicamente las fuentes de los recursos multimedia.
 * v1.0.1 - Incluye soporte para lazy loading de videos
 */

;(() => {
  const formatSupport = {
    avif: false,
    webp: false,
    webm: false,
  }

  function checkAvifSupport() {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(img.height === 1)
      }
      img.onerror = () => {
        resolve(false)
      }
      img.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
    })
  }

  function checkWebpSupport() {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve(img.height === 1)
      }
      img.onerror = () => {
        resolve(false)
      }
      img.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
    })
  }

  function checkWebmSupport() {
    const video = document.createElement("video")
    return Promise.resolve(!!video.canPlayType('video/webm; codecs="vp8, vorbis"'))
  }

  function updateImageSources(support) {
    updateLogoSources(support)

    if (support.webp) {
      const discoBall = document.getElementById("discoBall")
      if (discoBall) {
        const webpSource = discoBall.parentElement.querySelector('source[type="image/webp"]')
        if (webpSource && webpSource.srcset) {
          discoBall.setAttribute("data-original-src", discoBall.src)
        }
      }
    }
  }

  function updateVideoSources(support) {
    setupLazyVideoContainers(support)
  }

  function setupLazyVideoContainers(support) {
    window.videoFormatSupport = {
      webm: support.webm,
      preferredFormat: support.webm ? "webm" : "mp4",
    }

    console.log(
      "Configuración de videos diferidos completada. Formato preferido:",
      window.videoFormatSupport.preferredFormat,
    )
  }

  function updateLogoSources(support) {
    const logoImage = document.getElementById("logo-image")
    if (!logoImage) return

    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = document.documentElement.classList.contains("light-mode")
      ? "light"
      : document.documentElement.classList.contains("dark-mode")
        ? "dark"
        : isDarkMode
          ? "dark"
          : "light"

    if (theme === "dark") {
      if (support.avif) {
        logoImage.src = "./assets/images/patata-blanca.avif"
      } else if (support.webp) {
        logoImage.src = "./assets/images/patata-blanca.webp"
      } else {
        logoImage.src = "./assets/images/patata-blanca.png"
      }
    } else {
      if (support.avif) {
        logoImage.src = "./assets/images/patata-negra.avif"
      } else if (support.webp) {
        logoImage.src = "./assets/images/patata-negra.webp"
      } else {
        logoImage.src = "./assets/images/patata-negra.png"
      }
    }

    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        setTimeout(() => updateLogoSources(support), 50)
      })
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", () => {
      if (
        !document.documentElement.classList.contains("light-mode") &&
        !document.documentElement.classList.contains("dark-mode")
      ) {
        setTimeout(() => updateLogoSources(support), 50)
      }
    })
  }

  async function init() {
    try {
      const [avifSupport, webpSupport, webmSupport] = await Promise.all([
        checkAvifSupport(),
        checkWebpSupport(),
        checkWebmSupport(),
      ])

      formatSupport.avif = avifSupport
      formatSupport.webp = webpSupport
      formatSupport.webm = webmSupport

      console.log("Compatibilidad de formatos detectada:", formatSupport)

      updateImageSources(formatSupport)
      updateVideoSources(formatSupport)

      window.formatSupport = formatSupport
    } catch (error) {
      console.error("Error al detectar la compatibilidad de formatos:", error)
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()

