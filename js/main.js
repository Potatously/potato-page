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

  // Función centralizada para detectar el tema
  function detectTheme() {
    const isDarkMode =
      document.documentElement.classList.contains("dark-mode") ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !document.documentElement.classList.contains("light-mode"));
    return isDarkMode ? "dark" : "light";
  }

  // Función para actualizar las fuentes del logo basado en el tema y soporte de formatos
  function updateLogoSources(support) {
    const logoImage = document.getElementById("logo-image")
    if (!logoImage) return

    const theme = detectTheme()

    // Precargar las imágenes para ambos temas
    const darkImage = new Image()
    const lightImage = new Image()

    // Definir las rutas de las imágenes según el soporte de formatos
    let darkImageSrc = ""
    let lightImageSrc = ""

    // Asignar las rutas según el soporte de formatos
    if (support && support.avif) {
      darkImageSrc = "./assets/images/patata-blanca.avif"
      lightImageSrc = "./assets/images/papa-negra.avif"
    } else if (support && support.webp) {
      darkImageSrc = "./assets/images/patata-blanca.webp"
      lightImageSrc = "./assets/images/papa-negra.webp"
    } else {
      darkImageSrc = "./assets/images/patata-blanca.png"
      lightImageSrc = "./assets/images/papa-negra.png"
    }

    // Precargar ambas imágenes
    darkImage.src = darkImageSrc
    lightImage.src = lightImageSrc

    // Asignar la imagen correcta inmediatamente según el tema
    logoImage.src = theme === "dark" ? darkImageSrc : lightImageSrc

    // Asegurar que los atributos width y height se mantengan
    logoImage.width = 40
    logoImage.height = 40
  }

  //
  // SECCIÓN 2: FUNCIONALIDAD PRINCIPAL
  //

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
    hamburgerIcon: document.querySelector(".hamburger-icon"),
  }

  // Función para manejar errores de audio
  function handleAudioError(e) {
    if (e.target.error && e.target.error.code === MediaError.MEDIA_ERR_ABORTED) return
    console.error("Error de audio:", e.target.error ? e.target.error.message : "Error desconocido")
  }

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
    video.style.cssText = "width:100%;height:auto;max-width:800px;position:relative;z-index:1001;opacity:1;visibility:visible;"
    video.setAttribute("playsinline", "")
    video.setAttribute("data-src", "lazy")
    video.autoplay = false
    video.muted = true
    video.loop = true
    
    // Agregar texto alternativo según el tipo de video
    if (videoId === "homero") {
      video.setAttribute("aria-label", "Video de Homero Simpson apareciendo en una escena cómica")
    } else if (videoId === "dracukeo") {
      video.setAttribute("aria-label", "Video de una escena de Dragon Ball con efectos especiales")
    }
    
    // Solo ocultar para lectores de pantalla si es contenido decorativo
    if (videoId === "homero" || videoId === "dracukeo") {
      video.setAttribute("aria-hidden", "true")
    }

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

  // Optimizar el manejo de eventos de video
  function setupVideoEvents(video, videoId) {
    if (!video) return;

    const cleanup = () => {
      video.pause();
      video.currentTime = 0;
      video.style.display = "none";
      video.style.animation = "";
    };

    video.addEventListener("ended", cleanup);
    video.addEventListener("error", (e) => {
      console.error(`Error en video ${videoId}:`, e);
      cleanup();
    });

    return cleanup;
  }

  // Optimizar la carga de recursos
  const resourceLoader = {
    loaded: new Set(),
    
    async loadVideo(videoId) {
      if (this.loaded.has(videoId)) return videoCache[videoId];
      
      const video = createVideoElement(videoId);
      setupVideoEvents(video, videoId);
      this.loaded.add(videoId);
      return video;
    },
    
    async loadAudio(src) {
      if (this.loaded.has(src)) return;
      
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.addEventListener("error", handleAudioError);
      await new Promise((resolve, reject) => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
        audio.addEventListener("error", reject, { once: true });
        audio.load();
      });
      this.loaded.add(src);
    }
  };

  // Actualizar la función activateEasteregg para usar el nuevo resourceLoader
  async function activateEasteregg() {
    if (!elements.homeroVideoContainer) return;

    state.isEastereggActive = true;
    elements.eastereggOverlay.style.display = "flex";
    elements.eastereggOverlay.setAttribute("aria-hidden", "false");

    try {
      const homeroVideo = await resourceLoader.loadVideo("homero");
      elements.homeroVideoContainer.appendChild(homeroVideo);

      await playAudio("./assets/audio/puertazo.mp3");
      
      requestAnimationFrame(() => {
        if (elements.discoBall) {
          elements.discoBall.style.animation = "dropDiscoBall 1s forwards";
        }
        
        setTimeout(() => {
          if (homeroVideo) {
            homeroVideo.style.animation = "none";
            homeroVideo.offsetHeight; // Trigger reflow
            homeroVideo.style.animation = "fadeIn 2s forwards";
            homeroVideo.muted = !state.userInteracted;
            homeroVideo.play().catch((err) => {
              console.error("Error al reproducir:", err);
              homeroVideo.muted = true;
              homeroVideo.play();
            });
          }
        }, 800);
      });
    } catch (err) {
      console.error("Error al activar Easter egg:", err);
      state.isEastereggActive = false;
      elements.eastereggOverlay.style.display = "none";
      elements.eastereggOverlay.setAttribute("aria-hidden", "true");
    }
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
        } else if (state.clickCount >= 10) {
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
    elements.secondEastereggOverlay.setAttribute("aria-hidden", "false")

    if (!state.videosLoaded.dracukeo) {
      const dracukeoVideo = createVideoElement("dracukeo")
      elements.secondVideoContainer.appendChild(dracukeoVideo)
    }

    const secondVideo = document.getElementById("dracukeoVideo")

    // Cargar el video si está marcado como diferido
    if (secondVideo.hasAttribute("data-hidden")) {
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
      (src.includes("primero_bip.mp3") && audioCache.hover.readyState < 3) ||
      (src.includes("segundo_shine.mp3") && audioCache.hover2.readyState < 3) ||
      (src.includes("tercero_coin.mp3") && audioCache.hover3.readyState < 3) ||
      (src.includes("cuarto_meet.mp3") && audioCache.hover4.readyState < 3)
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
      } else if (src.includes("primero_bip.mp3")) {
        audio = audioCache.hover.cloneNode()
      } else if (src.includes("segundo_shine.mp3")) {
        audio = audioCache.hover2.cloneNode()
      } else if (src.includes("tercero_coin.mp3")) {
        audio = audioCache.hover3.cloneNode()
      } else if (src.includes("cuarto_meet.mp3")) {
        audio = audioCache.hover4.cloneNode()
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
      elements.eastereggOverlay.setAttribute("aria-hidden", "true")
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
      elements.eastereggOverlay.setAttribute("aria-hidden", "true")
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
      elements.secondEastereggOverlay.setAttribute("aria-hidden", "true")

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

        // Asegurar que los atributos width y height se mantengan
        elements.logoImage.width = 40
        elements.logoImage.height = 40
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

      // Actualizar ARIA para accesibilidad
      elements.themeToggle.setAttribute(
        "aria-label",
        newTheme === "dark-mode" ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
      )
    })
  }

  // Configurar menú de navegación
  if (elements.menuButton && elements.navLinks) {
    function toggleMenu(show) {
      state.menuOpen = show
      elements.menuButton.classList.toggle("menu-open", show)

      // Actualizar atributos ARIA
      elements.menuButton.setAttribute("aria-expanded", show)

      if (show) {
        elements.navLinks.classList.remove("closing")
        elements.navLinks.classList.add("active")

        // Actualizar texto del menú solo si existe
        if (elements.menuText) {
          elements.menuText.classList.add("menu-text-fade")
          setTimeout(() => {
            elements.menuText.textContent = "Cerrar"
            elements.menuText.classList.remove("menu-text-fade")
          }, 150)
        }
      } else {
        elements.navLinks.classList.add("closing")

        // Actualizar texto del menú solo si existe
        if (elements.menuText) {
          elements.menuText.classList.add("menu-text-fade")
          setTimeout(() => {
            elements.menuText.textContent = "Menú"
            elements.menuText.classList.remove("menu-text-fade")
          }, 150)
        }

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

  // Deshabilitar selección de texto excepto en elementos interactivos
  document.addEventListener("selectstart", (e) => {
    // Permitir selección en campos de texto y elementos editables
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.getAttribute("contenteditable") === "true"
    ) {
      return true
    }
    e.preventDefault()
  })

  // Inicializar al cargar la página
  window.addEventListener("load", () => {
    initializeTheme()

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

