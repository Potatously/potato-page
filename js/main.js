/**
 * main.js - Script principal del sitio web con detección de formatos
 * Versión: 3.0.0
 * Fusión de: script.js + format-detector.js
 */

console.log(`
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#####%@@@@@@@@@@@@@@@@@    
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+-       -+%@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@*             *@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@=               *@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@+                 %@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@#                  *@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@%                   *@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@-                   *@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@#-                    %@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@*-                     -@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@%*=                        =@@@@@@@@@@@@
    @@@@@@@@@@@@@@%*-                           *@@@@@@@@@@@@
    @@@@@@@@@@@@#=                              #@@@@@@@@@@@@
    @@@@@@@@@@@=                                @@@@@@@@@@@@@
    @@@@@@@@@%-                                -@@@@@@@@@@@@@
    @@@@@@@@@-                                 +@@@@@@@@@@@@@
    @@@@@@@@#                                  %@@@@@@@@@@@@@
    @@@@@@@@+                                 =@@@@@@@@@@@@@@
    @@@@@@@@*                                 %@@@@@@@@@@@@@@
    @@@@@@@@@-                               #@@@@@@@@@@@@@@@
    @@@@@@@@@%-                             #@@@@@@@@@@@@@@@@
    @@@@@@@@@@@=                          =%@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@%+                      =#@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@#*=-             -=*%@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@%%###**###%@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    `)
  
  console.log(`
      ██████╗  ██████╗ ████████╗ █████╗ ████████╗ ██████╗    | Busco una
      ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗   | Pelinegra
      ██████╔╝██║   ██║   ██║   ███████║   ██║   ██║   ██║   | Y
      ██╔═══╝ ██║   ██║   ██║   ██╔══██║   ██║   ██║   ██║   | Que
      ██║     ╚██████╔╝   ██║   ██║  ██║   ██║   ╚██████╔╝   | No
      ╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝    | Mienta
    `)
  
  // IIFE para encapsular todo el código y evitar contaminación del ámbito global
  ;(() => {
    //
    // SECCIÓN 1: DETECCIÓN DE FORMATOS
    //
  
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
  
    //
    // SECCIÓN 2: FUNCIONALIDAD PRINCIPAL
    //
  
    // Cache para recursos de audio
    const audioCache = {
      puertazo: new Audio("./assets/audio/puertazo.mp3"),
      pichon: new Audio("./assets/audio/pichon.mp3"),
      hover: new Audio("./assets/audio/bip.mp3"),
    }
  
    // Cache para recursos de video
    const videoCache = {
      homero: null,
      dracukeo: null,
    }
  
    // Estado de la aplicación
    const state = {
      pPressCount: 0,
      gPressCount: 0,
      clickCount: 0,
      isEastereggActive: false,
      isSecondEastereggActive: false,
      isGAudioPlaying: false,
      gAudioCooldown: false,
      gAudioTimer1: null,
      gAudioTimer2: null,
      MAX_COUNTER: 10,
      menuOpen: false,
      hoverAudioPlaying: false,
      hoverAudioCooldown: false,
      videosLoaded: {
        homero: false,
        dracukeo: false,
      },
      userInteracted: false,
    }
  
    // Temporizadores
    const timers = {
      pPress: null,
      gPress: null,
      click: null,
      hoverAudio: null,
    }
  
    // Referencias a elementos del DOM
    const elements = {
      themeToggle: document.getElementById("theme-toggle"),
      logoImage: document.getElementById("logo-image"),
      eastereggOverlay: document.getElementById("eastereggOverlay"),
      secondEastereggOverlay: document.getElementById("secondEastereggOverlay"),
      homeroVideoContainer: document.getElementById("homeroVideoContainer"),
      secondVideoContainer: document.getElementById("secondVideoContainer"),
      discoBall: document.getElementById("discoBall"),
      closeButton: document.getElementById("closeButton"),
      closeSecondButton: document.getElementById("closeSecondButton"),
      menuButton: document.getElementById("menu-button"),
      navLinks: document.getElementById("nav-links"),
      logoText: document.querySelector(".logo-text"),
      menuText: document.getElementById("menu-text"),
    }
  
    // Función para precargar audio
    function preloadAudio() {
      audioCache.puertazo.preload = "auto"
      audioCache.pichon.preload = "auto"
      audioCache.hover.preload = "auto"
      audioCache.puertazo.onerror = handleAudioError
      audioCache.pichon.onerror = handleAudioError
      audioCache.hover.onerror = handleAudioError
      audioCache.hover.volume = 1
    }
  
    // Función para manejar errores de audio
    function handleAudioError(e) {
      if (e.target.error.code === MediaError.MEDIA_ERR_ABORTED) return
      console.error("Error de audio:", e.target.error.message)
    }
  
    // Inicializar audio
    preloadAudio()
  
    // Configurar animación del logo
    if (elements.logoImage) {
      elements.logoImage.addEventListener("animationend", (e) => {
        elements.logoImage.classList.remove(e.animationName === "fadeInUp" ? "animate-in" : "shake")
      })
    }
  
    // Registrar interacción del usuario
    document.addEventListener("click", () => {
      if (!state.userInteracted) {
        state.userInteracted = true
        document.querySelectorAll("video").forEach((video) => {
          video.muted = false
        })
      }
    })
  
    // Función para reproducir sonido al pasar el ratón
    function playHoverSound() {
      // Detectar si es un dispositivo móvil
      const isMobile = window.matchMedia("(pointer: coarse)").matches
  
      // No reproducir sonido en dispositivos móviles
      if (isMobile || !state.userInteracted || state.hoverAudioPlaying || state.hoverAudioCooldown) return
  
      state.hoverAudioPlaying = true
      state.hoverAudioCooldown = true
  
      const hoverSound = audioCache.hover.cloneNode()
      hoverSound.volume = 1
  
      hoverSound
        .play()
        .then(() => {
          clearTimeout(timers.hoverAudio)
          timers.hoverAudio = setTimeout(() => {
            state.hoverAudioPlaying = false
  
            setTimeout(() => {
              state.hoverAudioCooldown = false
            }, 50)
          }, 100)
        })
        .catch((err) => {
          console.error("Error al reproducir sonido hover:", err)
          state.hoverAudioPlaying = false
          state.hoverAudioCooldown = false
        })
    }
  
    // Configurar sonidos al pasar el ratón
    function setupHoverSounds() {
      const hoverElements = document.querySelectorAll(
        ".logo-text, #menu-text, .footer-link, .nav-links a, .social-link, .theme-toggle-button, .close-button, .close-second-button",
      )
  
      hoverElements.forEach((element) => {
        element.addEventListener("mouseenter", playHoverSound)
      })
    }
  
    // Manejar pulsaciones de teclas para Easter eggs
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
  
      if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
        handleKeyPress("p")
      } else if (
        e.key.toLowerCase() === "g" &&
        !state.isGAudioPlaying &&
        !state.gAudioCooldown &&
        canActivateEasterEgg()
      ) {
        handleKeyPress("g")
      }
    })
  
    // Función para manejar pulsaciones de teclas
    function handleKeyPress(key) {
      const isP = key === "p"
      const countProperty = isP ? "pPressCount" : "gPressCount"
      const timerProperty = isP ? "pPress" : "gPress"
      const requiredCount = isP ? 5 : 4
      const timeout = isP ? 5000 : 4000
  
      state[countProperty]++
      state[countProperty] = Math.min(state[countProperty], state.MAX_COUNTER)
  
      if (state[countProperty] === 1) {
        clearTimeout(timers[timerProperty])
        timers[timerProperty] = setTimeout(() => (state[countProperty] = 0), timeout)
      } else if (state[countProperty] === requiredCount) {
        clearTimeout(timers[timerProperty])
        state[countProperty] = 0
        isP ? activateEasteregg() : activateGAudio()
      }
    }
  
    // Verificar si se puede activar un Easter egg
    function canActivateEasterEgg() {
      // Verificar si la terminal está activa
      const terminalActive = document.querySelector(".terminal-overlay") !== null
  
      // No permitir activar easter eggs si la terminal está activa
      if (terminalActive) {
        return false
      }
  
      return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
    }
  
    // Crear elemento de video para Easter eggs
    function createVideoElement(videoId) {
      if (videoCache[videoId]) {
        return videoCache[videoId]
      }
  
      const video = document.createElement("video")
      video.id = videoId + "Video"
      video.className = videoId + "-video"
      // Inicialmente oculto para evitar el primer frame estático
      video.style.cssText =
        "width:100%;height:auto;max-width:800px;position:relative;z-index:1001;opacity:1;visibility:visible;"
      video.setAttribute("playsinline", "") // Para iOS
      video.setAttribute("data-src", "lazy") // Marcar para carga diferida
      video.autoplay = false // Cambiar a false para carga diferida
      video.muted = true
      video.loop = true
  
      const preferredFormat = window.videoFormatSupport && window.videoFormatSupport.webm ? "webm" : "mp4"
      const fallbackFormat = preferredFormat === "webm" ? "mp4" : "webm"
  
      const sourcePreferred = document.createElement("source")
      sourcePreferred.dataset.src = `./assets/video/${videoId}.${preferredFormat}` // Usar data-src en lugar de src
      sourcePreferred.type = `video/${preferredFormat}`
  
      const sourceFallback = document.createElement("source")
      sourceFallback.dataset.src = `./assets/video/${videoId}.${fallbackFormat}` // Usar data-src en lugar de src
      sourceFallback.type = `video/${fallbackFormat}`
  
      const fallbackText = document.createTextNode("Tu navegador no soporta el elemento de video.")
  
      video.appendChild(sourcePreferred)
      video.appendChild(sourceFallback)
      video.appendChild(fallbackText)
  
      videoCache[videoId] = video
      state.videosLoaded[videoId] = true
  
      return video
    }
  
    // Activar Easter egg principal
    function activateEasteregg() {
      if (!elements.homeroVideoContainer) return
  
      state.isEastereggActive = true
      elements.eastereggOverlay.style.display = "flex"
  
      if (!state.videosLoaded.homero) {
        const homeroVideo = createVideoElement("homero")
        elements.homeroVideoContainer.appendChild(homeroVideo)
      }
  
      const homeroVideo = videoCache.homero
  
      // Cargar el video si está marcado como diferido
      if (homeroVideo.hasAttribute("data-src")) {
        const sources = homeroVideo.querySelectorAll("source")
        sources.forEach((source) => {
          if (source.dataset.src) {
            source.src = source.dataset.src
            source.removeAttribute("data-src")
          }
        })
        homeroVideo.removeAttribute("data-src")
        homeroVideo.load()
      }
  
      playAudio("./assets/audio/puertazo.mp3").then(() => {
        requestAnimationFrame(() => {
          if (elements.discoBall) {
            elements.discoBall.style.animation = "dropDiscoBall 1s forwards"
          }
          setTimeout(() => {
            if (homeroVideo) {
              homeroVideo.style.animation = "none"
              homeroVideo.offsetHeight /* Trigger reflow */
              homeroVideo.style.animation = "fadeIn 2s forwards"
              homeroVideo.muted = !state.userInteracted
              homeroVideo.play().catch((err) => {
                console.error("Error al reproducir:", err)
                homeroVideo.muted = true
                homeroVideo.play()
              })
  
              // Registrar interacción si existe el monitor de rendimiento
              if (window.performanceMonitor) {
                window.performanceMonitor.recordInteraction("easterEggActivated", {
                  type: "homero",
                  timestamp: new Date().toISOString(),
                })
              }
            }
          }, 800)
        })
      })
    }
  
    // Configurar evento de clic en el logo para Easter egg secundario
    if (elements.logoImage) {
      elements.logoImage.addEventListener("click", () => {
        if (canActivateEasterEgg()) {
          elements.logoImage.classList.remove("shake")
          setTimeout(() => {
            elements.logoImage.classList.add("shake")
          }, 10)
  
          state.clickCount++
          if (state.clickCount === 1) {
            clearTimeout(timers.click)
            timers.click = setTimeout(() => (state.clickCount = 0), 2000)
          } else if (state.clickCount >= 8) {
            clearTimeout(timers.click)
            state.clickCount = 0
            activateSecondEasteregg()
          }
        }
      })
    }
  
    // Activar Easter egg secundario
    function activateSecondEasteregg() {
      state.isSecondEastereggActive = true
      elements.secondEastereggOverlay.style.display = "flex"
  
      if (!state.videosLoaded.dracukeo) {
        const dracukeoVideo = createVideoElement("dracukeo")
        elements.secondVideoContainer.appendChild(dracukeoVideo)
      }
  
      const secondVideo = document.getElementById("dracukeoVideo")
  
      // Cargar el video si está marcado como diferido
      if (secondVideo.hasAttribute("data-src")) {
        const sources = secondVideo.querySelectorAll("source")
        sources.forEach((source) => {
          if (source.dataset.src) {
            source.src = source.dataset.src
            source.removeAttribute("data-src")
          }
        })
        secondVideo.removeAttribute("data-src")
        secondVideo.load()
      }
  
      if (secondVideo) {
        secondVideo.muted = !state.userInteracted
        secondVideo.currentTime = 0
        secondVideo.style.visibility = "visible"
        secondVideo.style.opacity = "1"
        secondVideo.removeAttribute("hidden")
  
        requestAnimationFrame(() => {
          secondVideo.style.display = "block" // Mostrar justo antes de la animación
          secondVideo.style.animation = "fadeIn 2s forwards"
          playVideo(secondVideo)
  
          // Registrar interacción si existe el monitor de rendimiento
          if (window.performanceMonitor) {
            window.performanceMonitor.recordInteraction("easterEggActivated", {
              type: "dracukeo",
              timestamp: new Date().toISOString(),
            })
          }
        })
      }
    }
  
    // Reproducir audio con manejo de errores
    async function playAudio(src) {
      if (!src || !src.startsWith("./assets/audio/")) {
        throw new Error("Ruta de audio inválida")
      }
  
      if (
        (src.includes("puertazo.mp3") && audioCache.puertazo.readyState < 3) ||
        (src.includes("pichon.mp3") && audioCache.pichon.readyState < 3) ||
        (src.includes("bip.mp3") && audioCache.hover.readyState < 3)
      ) {
        throw new Error("Audio no cargado completamente")
      }
  
      if (!state.userInteracted) {
        console.warn("Reproducción bloqueada: el usuario no ha interactuado")
        return
      }
  
      try {
        let audio
        if (src.includes("puertazo.mp3")) {
          audio = audioCache.puertazo.cloneNode()
        } else if (src.includes("pichon.mp3")) {
          audio = audioCache.pichon.cloneNode()
        } else if (src.includes("bip.mp3")) {
          audio = audioCache.hover.cloneNode()
        } else {
          throw new Error("Audio no precargado")
        }
  
        audio.preload = "auto"
        audio.addEventListener("error", handleAudioError)
        await audio.play()
      } catch (err) {
        console.error("Error al activar Easter egg:", err)
        state.isEastereggActive = false
        elements.eastereggOverlay.style.display = "none"
        throw err
      }
    }
  
    // Reproducir video con manejo de errores
    async function playVideo(video) {
      if (!video) {
        console.error("Elemento video no encontrado")
        return
      }
  
      if (!state.userInteracted) {
        console.warn("Reproducción bloqueada: el usuario no ha interactuado")
        return
      }
  
      try {
        video.muted = !state.userInteracted
        await video.play()
      } catch (err) {
        console.error("Error:", err)
        throw err
      }
    }
  
    // Configurar botón de cierre para Easter egg principal
    if (elements.closeButton && elements.closeButton instanceof HTMLElement) {
      elements.closeButton.addEventListener("click", () => {
        elements.discoBall.style.removeProperty("animation")
        elements.discoBall.style.top = "-100px"
        state.isEastereggActive = false
        elements.eastereggOverlay.style.display = "none"
        elements.discoBall.style.animation = ""
  
        const homeroVideo = videoCache.homero
        if (homeroVideo) {
          homeroVideo.style.animation = ""
          homeroVideo.pause()
          homeroVideo.muted = true
          homeroVideo.currentTime = 0
          homeroVideo.style.display = "none" // Ocultar al cerrar
        }
  
        if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
        if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
      })
    }
  
    // Configurar botón de cierre para Easter egg secundario
    if (elements.closeSecondButton instanceof HTMLElement) {
      elements.closeSecondButton.addEventListener("click", () => {
        state.isSecondEastereggActive = false
        elements.secondEastereggOverlay.style.display = "none"
  
        const secondVideoElement = document.getElementById("dracukeoVideo")
        if (secondVideoElement) {
          secondVideoElement.style.animation = ""
          secondVideoElement.pause()
          secondVideoElement.currentTime = 0
          secondVideoElement.style.display = "none" // Ocultar al cerrar
        }
      })
    }
  
    // Activar audio para Easter egg "G"
    function activateGAudio() {
      if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
      if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
  
      state.isGAudioPlaying = true
  
      playAudio("./assets/audio/pichon.mp3")
        .then(() => {
          state.gAudioTimer1 = setTimeout(() => {
            state.isGAudioPlaying = false
            state.gAudioCooldown = true
  
            state.gAudioTimer2 = setTimeout(() => {
              state.gAudioCooldown = false
            }, 2000)
          }, 2000)
        })
        .catch((err) => {
          console.error('Error en audio "G":', err)
          clearTimeout(state.gAudioTimer1)
          clearTimeout(state.gAudioTimer2)
          state.isGAudioPlaying = false
          state.gAudioCooldown = false
        })
    }
  
    // Inicializar tema
    function initializeTheme() {
      const root = document.documentElement
      const savedTheme = localStorage.getItem("theme")
      const validThemes = ["light-mode", "dark-mode"]
      const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"
  
      root.classList.remove(...validThemes)
      root.classList.add(theme)
      updateTheme(theme)
    }
  
    // Actualizar fuentes de medios según el tema
    function updateMediaSourcesForTheme(theme) {
      if (elements.logoImage) {
        const isDark = theme === "dark-mode"
  
        // Definir las rutas de las imágenes
        let logoSrc = ""
  
        if (isDark) {
          // Modo oscuro - usar patata blanca
          if (typeof window.formatSupport !== "undefined" && window.formatSupport.avif) {
            logoSrc = "./assets/images/patata-blanca.avif"
          } else if (window.formatSupport && window.formatSupport.webp) {
            logoSrc = "./assets/images/patata-blanca.webp"
          } else {
            logoSrc = "./assets/images/patata-blanca.png"
          }
        } else {
          // Modo claro - usar patata negra
          if (typeof window.formatSupport !== "undefined" && window.formatSupport.avif) {
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
          // La imagen existe, asignarla al logo
          elements.logoImage.src = logoSrc
        }
  
        tempImg.onerror = () => {
          // La imagen no existe, usar una imagen de respaldo
          console.error("Error al cargar la imagen:", logoSrc)
          elements.logoImage.src = isDark
            ? "./assets/images/fallback-logo-dark.png"
            : "./assets/images/fallback-logo-light.png"
        }
  
        tempImg.src = logoSrc
      }
    }
  
    // Actualizar tema
    function updateTheme(theme) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", theme === "light-mode" ? "#ffffff" : "#0a0a0b")
      }
  
      updateMediaSourcesForTheme(theme)
  
      const themeToggleButton = document.querySelector(".theme-toggle-button")
      if (themeToggleButton) {
        themeToggleButton.style.color = theme === "dark-mode" ? "#ffffff" : "#000000"
      }
    }
  
    // Configurar botón de cambio de tema
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", () => {
        const root = document.documentElement
        const newTheme = root.classList.contains("light-mode") ? "dark-mode" : "light-mode"
  
        root.classList.remove("light-mode", "dark-mode")
        root.classList.add(newTheme)
        localStorage.setItem("theme", newTheme)
        updateTheme(newTheme)
      })
    }
  
    // Configurar menú de navegación
    if (elements.menuButton && elements.navLinks) {
      function toggleMenu(show) {
        state.menuOpen = show
        elements.menuButton.classList.toggle("menu-open", show)
  
        if (show) {
          elements.navLinks.classList.remove("closing")
          elements.navLinks.classList.add("active")
          elements.menuText.classList.add("menu-text-fade")
          setTimeout(() => {
            elements.menuText.textContent = "Cerrar"
            elements.menuText.classList.remove("menu-text-fade")
          }, 150)
        } else {
          elements.navLinks.classList.add("closing")
          elements.menuText.classList.add("menu-text-fade")
          setTimeout(() => {
            elements.menuText.textContent = "Menú"
            elements.menuText.classList.remove("menu-text-fade")
          }, 150)
  
          setTimeout(() => {
            elements.navLinks.classList.remove("active", "closing")
          }, 500)
        }
      }
  
      elements.menuButton.addEventListener("click", () => {
        toggleMenu(!state.menuOpen)
      })
  
      document.addEventListener("click", (e) => {
        if (state.menuOpen && !elements.menuButton.contains(e.target) && !elements.navLinks.contains(e.target)) {
          toggleMenu(false)
        }
      })
  
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && state.menuOpen) {
          toggleMenu(false)
        }
      })
    }
  
    // Configurar comportamiento del logo
    if (elements.logoText) {
      elements.logoText.addEventListener("click", (e) => {
        const isHomePage =
          window.location.pathname === "/" ||
          window.location.pathname === "/index.html" ||
          window.location.pathname.endsWith("/")
  
        if (!isHomePage) {
          window.location.href = "https://potatously.vercel.app"
        }
  
        if (isHomePage) {
          e.preventDefault()
        }
      })
    }
  
    // Deshabilitar selección de texto
    document.addEventListener("selectstart", (e) => e.preventDefault())
  
    // Inicializar al cargar la página
    window.addEventListener("load", () => {
      initializeTheme()
      setupHoverSounds()
  
      requestAnimationFrame(() => {
        document.documentElement.style.overflow = "auto"
        document.body.style.overflow = "auto"
        document.body.style.height = "auto"
      })
  
      const socialLink = document.querySelector(".social-link")
      if (socialLink) {
        const computedStyle = window.getComputedStyle(socialLink)
        const animationDelay = Number.parseFloat(computedStyle.animationDelay) || 0
        const animationDuration = Number.parseFloat(computedStyle.animationDuration) || 0
        const currentTime = (performance.now() / 1000) % animationDuration
        socialLink.style.setProperty("--animation-progress", `${currentTime}s`)
      }
  
      const isMobile = window.matchMedia("(pointer: coarse)").matches
      if (isMobile) {
        document.body.classList.add("mobile-device")
      }
  
      // Verificar el logo después de que todo esté cargado
      setTimeout(() => {
        if (elements.logoImage) {
          const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          const hasLightClass = document.documentElement.classList.contains("light-mode")
          const hasDarkClass = document.documentElement.classList.contains("dark-mode")
  
          const theme = hasDarkClass
            ? "dark-mode"
            : hasLightClass
              ? "light-mode"
              : isDarkMode
                ? "dark-mode"
                : "light-mode"
  
          updateMediaSourcesForTheme(theme)
        }
      }, 500)
    })
  
    // Agregar un listener para el evento de cambio de tema del sistema
    const systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    systemThemeMediaQuery.addEventListener("change", (e) => {
      // Solo actualizar si no hay un tema explícito establecido
      if (
        !document.documentElement.classList.contains("light-mode") &&
        !document.documentElement.classList.contains("dark-mode")
      ) {
        const newTheme = e.matches ? "dark-mode" : "light-mode"
        updateTheme(newTheme)
      }
    })
  
    // Agregar un listener para cuando la terminal se cierre
    document.addEventListener("DOMContentLoaded", () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.removedNodes.length > 0) {
            const terminalRemoved = Array.from(mutation.removedNodes).some(
              (node) => node.classList && node.classList.contains("terminal-overlay"),
            )
  
            if (terminalRemoved) {
              setTimeout(() => {
                const currentTheme = document.documentElement.classList.contains("light-mode")
                  ? "light-mode"
                  : "dark-mode"
                updateMediaSourcesForTheme(currentTheme)
              }, 200)
            }
          }
        })
      })
  
      observer.observe(document.body, { childList: true })
    })
  
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
      })
    })
  
    // Exponer funciones globales necesarias
    window.updateMediaSourcesForTheme = updateMediaSourcesForTheme
    window.updateLogoSources = (support) => {
      if (window.formatSupport) {
        updateLogoSources(window.formatSupport)
      }
    }
  })()
  
  